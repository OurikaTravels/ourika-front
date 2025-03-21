"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { Edit, Trash2, Search, Plus, Filter, ChevronLeft, ChevronRight, AlertCircle, Loader, X } from "lucide-react"
import DashboardHeader from "../../../../components/dashboard/DashboardHeader"
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar"
import highlightApi from "../../../../services/highlightApi"
import { toast } from "react-hot-toast"

export default function HighlightsManagement() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("treks")
  const [notifications] = useState(3)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [highlightToDelete, setHighlightToDelete] = useState(null)
  const [highlightToEdit, setHighlightToEdit] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [highlights, setHighlights] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    content: "",
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchHighlights()
  }, [])

  const fetchHighlights = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await highlightApi.getAllHighlights()
      if (response.success) {
        setHighlights(Array.isArray(response.data) ? response.data : [])
      } else {
        setError(response.message || "Failed to fetch highlights")
        toast.error(response.message || "Failed to fetch highlights")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching highlights"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter highlights based on search term
  const filteredHighlights = Array.isArray(highlights)
    ? highlights.filter((highlight) => highlight.content.toLowerCase().includes(searchTerm.toLowerCase()))
    : []

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentHighlights = filteredHighlights.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredHighlights.length / itemsPerPage)

  const handleDeleteClick = (highlight) => {
    setHighlightToDelete(highlight)
    setShowDeleteModal(true)
  }

  const handleEditClick = (highlight) => {
    setHighlightToEdit(highlight)
    setFormData({
      content: highlight.content,
    })
    setFormErrors({})
    setShowEditModal(true)
  }

  const handleAddClick = () => {
    setFormData({
      content: "",
    })
    setFormErrors({})
    setShowAddModal(true)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.content.trim()) errors.content = "Highlight content is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const confirmDelete = async () => {
    setIsSubmitting(true)
    try {
      const response = await highlightApi.deleteHighlight(highlightToDelete.id)
      if (response.success) {
        setHighlights(highlights.filter((highlight) => highlight.id !== highlightToDelete.id))
        toast.success("Highlight deleted successfully")
      } else {
        toast.error(response.message || "Failed to delete highlight")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting the highlight")
    } finally {
      setIsSubmitting(false)
      setShowDeleteModal(false)
      setHighlightToDelete(null)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const handleAddSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await highlightApi.createHighlight(formData)
      if (response.success) {
        setHighlights([...highlights, response.data])
        toast.success("Highlight created successfully")
        setShowAddModal(false)
      } else {
        toast.error(response.message || "Failed to create highlight")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while creating the highlight")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await highlightApi.updateHighlight(highlightToEdit.id, formData)
      if (response.success) {
        setHighlights(
          highlights.map((highlight) =>
            highlight.id === highlightToEdit.id ? { ...highlight, ...formData } : highlight,
          ),
        )
        toast.success("Highlight updated successfully")
        setShowEditModal(false)
      } else {
        toast.error(response.message || "Failed to update highlight")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while updating the highlight")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#191b20] text-white flex">
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <DashboardHeader user={user} notifications={notifications} />

        <main className="p-6">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Highlights Management</h1>
              <p className="mt-1 text-gray-400">Manage all highlights for treks and tours</p>
            </div>
            <button
              onClick={handleAddClick}
              className="flex items-center px-4 py-2 bg-[#fe5532] text-white rounded-lg hover:bg-[#fe5532]/90 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Highlight
            </button>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search highlights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-[#232630] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
            <button
              onClick={fetchHighlights}
              className="px-4 py-2 bg-[#232630] text-gray-300 rounded-lg border border-gray-700 hover:bg-[#232630]/80 transition-colors flex items-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#fe5532]/10 border-l-4 border-[#fe5532] text-[#fe5532] rounded">{error}</div>
          )}

          <div className="bg-[#232630] rounded-lg shadow-md overflow-hidden border border-gray-800">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader className="w-8 h-8 text-[#fe5532] animate-spin" />
                <span className="ml-2 text-gray-400">Loading highlights...</span>
              </div>
            ) : highlights.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#191b20] mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No highlights found</h3>
                <p className="text-gray-400 mb-4">
                  There are no highlights available. Get started by creating a new highlight.
                </p>
                <button
                  onClick={handleAddClick}
                  className="inline-flex items-center px-4 py-2 bg-[#fe5532] text-white rounded-lg hover:bg-[#fe5532]/90 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Highlight
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-[#191b20]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Content
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {currentHighlights.map((highlight) => (
                      <tr key={highlight.id} className="hover:bg-[#191b20]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{highlight.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-white">{highlight.content}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditClick(highlight)}
                              className="text-[#56acfe] hover:text-[#56acfe]/80 p-1"
                              aria-label="Edit highlight"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(highlight)}
                              className="text-[#fe5532] hover:text-[#fe5532]/80 p-1"
                              aria-label="Delete highlight"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && highlights.length > 0 && totalPages > 1 && (
              <div className="px-6 py-4 bg-[#232630] border-t border-gray-800 flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      Showing <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to{" "}
                      <span className="font-medium text-white">
                        {Math.min(indexOfLastItem, filteredHighlights.length)}
                      </span>{" "}
                      of <span className="font-medium text-white">{filteredHighlights.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-[#191b20] text-sm font-medium text-gray-400 hover:bg-[#191b20]/70 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === i + 1
                              ? "bg-[#fe5532] text-white border-[#fe5532]"
                              : "bg-[#191b20] text-gray-300 border-gray-700 hover:bg-[#191b20]/70"
                          } text-sm font-medium`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-[#191b20] text-sm font-medium text-gray-400 hover:bg-[#191b20]/70 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#232630] rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-700">
            <div className="flex items-center text-[#fe5532] mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this highlight? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#191b20] text-gray-300 rounded-md hover:bg-[#191b20]/70 transition-colors disabled:opacity-70 border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors disabled:opacity-70 flex items-center shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin w-4 h-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Highlight Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#232630] rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Add New Highlight</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                    Highlight Content <span className="text-[#fe5532]">*</span>
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleFormChange}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      formErrors.content ? "border-[#fe5532]" : "border-gray-700"
                    } bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent`}
                    placeholder="Enter highlight content"
                  ></textarea>
                  {formErrors.content && <p className="mt-1 text-sm text-[#fe5532]">{formErrors.content}</p>}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#191b20] text-gray-300 rounded-md hover:bg-[#191b20]/70 transition-colors disabled:opacity-70 border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors disabled:opacity-70 flex items-center shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin w-4 h-4 mr-2" />
                      Adding...
                    </>
                  ) : (
                    "Add Highlight"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Highlight Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#232630] rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Edit Highlight</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-content" className="block text-sm font-medium text-gray-300 mb-1">
                    Highlight Content <span className="text-[#fe5532]">*</span>
                  </label>
                  <textarea
                    id="edit-content"
                    name="content"
                    value={formData.content}
                    onChange={handleFormChange}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      formErrors.content ? "border-[#fe5532]" : "border-gray-700"
                    } bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent`}
                  ></textarea>
                  {formErrors.content && <p className="mt-1 text-sm text-[#fe5532]">{formErrors.content}</p>}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#191b20] text-gray-300 rounded-md hover:bg-[#191b20]/70 transition-colors disabled:opacity-70 border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors disabled:opacity-70 flex items-center shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin w-4 h-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

