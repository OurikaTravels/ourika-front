"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { Link } from "react-router-dom"
import { Edit, Trash, Eye, Search, Plus, Loader, Info } from "lucide-react"
import { toast } from "react-hot-toast"
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
    <div className="min-h-screen bg-[#191b20] text-white flex">
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>

        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">All Treks</h1>
              <Link
                to="/admin/treks/add-trek"
                className="flex items-center px-4 py-2 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Trek
              </Link>
            </div>
            <p className="text-gray-400">Manage your trek experiences</p>
          </div>

          {/* Search and Filters */}
          <div className="bg-[#232630] rounded-lg shadow-md p-4 mb-6 border border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search treks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#fe5532]/10 border-l-4 border-[#fe5532] text-[#fe5532] rounded">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Treks Table */}
          <div className="bg-[#232630] rounded-lg shadow-md overflow-hidden border border-gray-800">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader className="w-8 h-8 text-[#fe5532] animate-spin" />
                <span className="ml-2 text-gray-400">Loading treks...</span>
              </div>
            ) : filteredTreks.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-gray-400">
                  {searchTerm ? "No treks match your search criteria" : "No treks found. Create your first trek!"}
                </p>
                {!searchTerm && (
                  <Link
                    to="/admin/treks/add-trek"
                    className="inline-flex items-center mt-4 px-4 py-2 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Trek
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#191b20]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Trek
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredTreks.map((trek) => (
                      <tr key={trek.id} className="hover:bg-[#191b20]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md bg-[#191b20] overflow-hidden">
                              {trek.images && trek.images.length > 0 ? (
                                <img
                                  src={`http://localhost:8080/api/uploads/images/${trek.images.find((img) => img.isPrimary)?.path || trek.images[0].path}`}
                                  alt={trek.title}
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 flex items-center justify-center text-gray-500">No img</div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{trek.title}</div>
                              <div className="text-sm text-gray-400">
                                {trek.description.length > 50
                                  ? `${trek.description.substring(0, 50)}...`
                                  : trek.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{trek.startLocation}</div>
                          <div className="text-sm text-gray-400">to {trek.endLocation}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{trek.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">${trek.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/treks/${trek.id}/preview`}
                              className="text-[#56acfe] hover:text-[#56acfe]/80 p-1"
                              title="Preview"
                            >
                              <Eye className="w-5 h-5" />
                            </Link>
                            <Link
                              to={`/admin/treks/${trek.id}/edit`}
                              className="text-[#56acfe] hover:text-[#56acfe]/80 p-1"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteTrek(trek.id, trek.title)}
                              disabled={isDeleting}
                              className="text-[#fe5532] hover:text-[#fe5532]/80 p-1 disabled:opacity-50"
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

