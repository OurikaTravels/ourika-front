"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { Link } from "react-router-dom"
import { Edit, Trash, Eye, Search, Plus, Loader, Info } from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardHeader from "../../../../components/dashboard/DashboardHeader"
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar"
import trekApi from "../../../../services/trekApi"

export default function AllTreks() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("treks")
  const [notifications] = useState(3)
  const [treks, setTreks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchTreks()
  }, [])

  const fetchTreks = async () => {
    setIsLoading(true)
    try {
      const response = await trekApi.getAllTreks()
      if (response.success) {
        setTreks(response.data)
      } else {
        setError(response.message || "Failed to fetch treks")
        toast.error(response.message || "Failed to fetch treks")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching treks"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTrek = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      setIsDeleting(true)
      try {
        const response = await trekApi.deleteTrek(id)
        if (response.success) {
          setTreks(treks.filter((trek) => trek.id !== id))
          toast.success("Trek deleted successfully")
        } else {
          throw new Error(response.message || "Failed to delete trek")
        }
      } catch (err) {
        const errorMessage = err.message || "An error occurred while deleting the trek"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const filteredTreks = treks.filter(
    (trek) =>
      trek.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trek.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <DashboardHeader user={user} notifications={notifications} />

        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Treks</h1>
              <Link
                to="/admin/treks/add-trek"
                className="flex items-center px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Trek
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Manage your trek experiences</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search treks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Treks Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader className="w-8 h-8 text-[#ff5c5c] animate-spin" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Loading treks...</span>
              </div>
            ) : filteredTreks.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? "No treks match your search criteria" : "No treks found. Create your first trek!"}
                </p>
                {!searchTerm && (
                  <Link
                    to="/admin/treks/add-trek"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Trek
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Trek
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTreks.map((trek) => (
                      <tr key={trek.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              {trek.images && trek.images.length > 0 ? (
                                <img
                                  src={`http://localhost:8080/api/images/${trek.images.find((img) => img.isPrimary)?.path || trek.images[0].path}`}
                                  alt={trek.title}
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                  No img
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{trek.title}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {trek.description.length > 50
                                  ? `${trek.description.substring(0, 50)}...`
                                  : trek.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{trek.startLocation}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">to {trek.endLocation}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{trek.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">${trek.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/treks/${trek.id}/preview`}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              title="Preview"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                            <Link
                              to={`/admin/treks/${trek.id}/edit`}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTrek(trek.id, trek.title)}
                              disabled={isDeleting}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                              title="Delete"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

