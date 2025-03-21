"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { Edit, Trash2, Search, Plus, Filter, ChevronLeft, ChevronRight, AlertCircle, Loader, X } from "lucide-react"
import DashboardHeader from "../../../../components/dashboard/DashboardHeader"
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar"
import serviceApi from "../../../../services/serviceApi"
import { toast } from "react-hot-toast"

export default function ServiceManagement() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("treks")
  const [notifications] = useState(3)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [serviceToEdit, setServiceToEdit] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await serviceApi.getAllServices()
      if (response.success) {
        setServices(response.data)
      } else {
        setError(response.message || "Failed to fetch services")
        toast.error(response.message || "Failed to fetch services")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching services"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Filter services based on search term
  const filteredServices = services.filter((service) => service.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)

  const handleDeleteClick = (service) => {
    setServiceToDelete(service)
    setShowDeleteModal(true)
  }

  const handleEditClick = (service) => {
    setServiceToEdit(service)
    setFormData({
      name: service.name,
    })
    setFormErrors({})
    setShowEditModal(true)
  }

  const handleAddClick = () => {
    setFormData({
      name: "",
    })
    setFormErrors({})
    setShowAddModal(true)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "Service name is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const confirmDelete = async () => {
    setIsSubmitting(true)
    try {
      const response = await serviceApi.deleteService(serviceToDelete.id)
      if (response.success) {
        setServices(services.filter((service) => service.id !== serviceToDelete.id))
        toast.success("Service deleted successfully")
      } else {
        toast.error(response.message || "Failed to delete service")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting the service")
    } finally {
      setIsSubmitting(false)
      setShowDeleteModal(false)
      setServiceToDelete(null)
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
      const response = await serviceApi.createService(formData)
      if (response.success) {
        setServices([...services, response.data])
        toast.success("Service created successfully")
        setShowAddModal(false)
      } else {
        toast.error(response.message || "Failed to create service")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while creating the service")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await serviceApi.updateService(serviceToEdit.id, formData)
      if (response.success) {
        setServices(
          services.map((service) => (service.id === serviceToEdit.id ? { ...service, ...formData } : service)),
        )
        toast.success("Service updated successfully")
        setShowEditModal(false)
      } else {
        toast.error(response.message || "Failed to update service")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while updating the service")
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
              <h1 className="text-2xl font-bold text-white">Service Management</h1>
              <p className="mt-1 text-gray-400">Manage all services for treks and tours</p>
            </div>
            <button
              onClick={handleAddClick}
              className="flex items-center px-4 py-2 bg-[#fe5532] text-white rounded-lg hover:bg-[#fe5532]/90 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Service
            </button>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-[#232630] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent transition-all"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
            <button
              onClick={fetchServices}
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
                <span className="ml-2 text-gray-400">Loading services...</span>
              </div>
            ) : services.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#191b20] mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No services found</h3>
                <p className="text-gray-400 mb-4">
                  There are no services available. Get started by creating a new service.
                </p>
                <button
                  onClick={handleAddClick}
                  className="inline-flex items-center px-4 py-2 bg-[#fe5532] text-white rounded-lg hover:bg-[#fe5532]/90 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Service
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
                        Name
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
                    {currentServices.map((service) => (
                      <tr key={service.id} className="hover:bg-[#191b20]/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{service.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{service.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEditClick(service)}
                              className="text-[#56acfe] hover:text-[#56acfe]/80 p-1"
                              aria-label="Edit service"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(service)}
                              className="text-[#fe5532] hover:text-[#fe5532]/80 p-1"
                              aria-label="Delete service"
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

            {!isLoading && services.length > 0 && totalPages > 1 && (
              <div className="px-6 py-4 bg-[#232630] border-t border-gray-800 flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      Showing <span className="font-medium text-white">{indexOfFirstItem + 1}</span> to{" "}
                      <span className="font-medium text-white">
                        {Math.min(indexOfLastItem, filteredServices.length)}
                      </span>{" "}
                      of <span className="font-medium text-white">{filteredServices.length}</span> results
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
              Are you sure you want to delete the service "{serviceToDelete?.name}"? This action cannot be undone.
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

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#232630] rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Add New Service</h3>
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
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Service Name <span className="text-[#fe5532]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      formErrors.name ? "border-[#fe5532]" : "border-gray-700"
                    } bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent`}
                    placeholder="Enter service name"
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-[#fe5532]">{formErrors.name}</p>}
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
                    "Add Service"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#232630] rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Edit Service</h3>
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
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-300 mb-1">
                    Service Name <span className="text-[#fe5532]">*</span>
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      formErrors.name ? "border-[#fe5532]" : "border-gray-700"
                    } bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent`}
                  />
                  {formErrors.name && <p className="mt-1 text-sm text-[#fe5532]">{formErrors.name}</p>}
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

