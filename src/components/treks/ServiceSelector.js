"use client"

import { useState } from "react"
import { Plus, Trash2, Loader, Search, Info, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import serviceApi from "../../services/serviceApi"

/**
 * Component for selecting services for a trek
 */
export default function ServiceSelector({ trekId, availableServices, selectedServices, setSelectedServices }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serviceId, setServiceId] = useState("")
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredService, setHoveredService] = useState(null)

  /**
   * Add a service to the trek by ID
   */
  const addServiceById = async (serviceIdToAdd) => {
    if (!trekId) {
      console.error("Trek ID is missing:", trekId)
      toast.error("Trek ID is missing. Please complete step 1 first.")
      return
    }

    // Convert serviceId to a number for consistent comparison
    const serviceIdNum = Number.parseInt(serviceIdToAdd)

    // Check if already selected
    if (selectedServices.some((s) => s.id === serviceIdNum)) {
      toast.error("This service is already selected")
      return
    }

    // Find the service in available services
    const serviceToAdd = availableServices.find((s) => s.id === serviceIdNum)
    if (!serviceToAdd) {
      toast.error("Service ID not found in available services")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      console.log("Adding service to trek:", { trekId, serviceId: serviceIdNum })

      // Convert serviceId to a number before passing to API
      const response = await serviceApi.addServiceToTrek(trekId, serviceIdNum)

      console.log("API response:", response)

      if (!response.success) {
        throw new Error(response.message || "Failed to add service to trek")
      }

      // Update the UI immediately
      setSelectedServices((prev) => [...prev, serviceToAdd])
      setServiceId("") // Clear the input
      toast.success("Service added to trek successfully")
    } catch (err) {
      console.error("Error adding service:", err)
      setError(err.message || "Failed to add service to trek")
      toast.error(err.message || "Failed to add service to trek")
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!serviceId.trim()) {
      setError("Please enter a service ID")
      return
    }

    addServiceById(serviceId)
  }

  /**
   * Remove a service from the trek
   */
  const removeServiceFromTrek = async (serviceId) => {
    if (!trekId) {
      toast.error("Trek ID is missing")
      return
    }

    setIsSubmitting(true)
    try {
      console.log("Removing service from trek:", { trekId, serviceId })

      // Make sure serviceId is a number
      const response = await serviceApi.removeServiceFromTrek(trekId, serviceId)

      console.log("API response:", response)

      if (!response.success) {
        throw new Error(response.message || "Failed to remove service from trek")
      }

      // Update the UI immediately
      setSelectedServices((prev) => prev.filter((s) => s.id !== serviceId))
      toast.success("Service removed from trek successfully")
    } catch (err) {
      console.error("Error removing service:", err)
      toast.error(err.message || "Failed to remove service from trek")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter services based on search term
  const filteredServices = availableServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.id.toString().includes(searchTerm),
  )

  return (
    <div className="space-y-8">
      {/* Info message */}
      {trekId ? (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-700 dark:text-blue-300 rounded">
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>Click on any service from the table below to add it to your trek, or use the ID input field.</p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-700 dark:text-amber-300 rounded">
          <div className="flex items-center">
            <Info className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>Trek ID is missing. Please complete step 1 first.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Services */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Services</h3>

          {/* Search and Add service form */}
          <div className="space-y-4 mb-5">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
                placeholder="Search services..."
              />
            </div>

            {/* Add by ID */}
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <div className="flex-1">
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Add by ID
                </label>
                <input
                  type="number"
                  id="serviceId"
                  value={serviceId}
                  onChange={(e) => {
                    setServiceId(e.target.value)
                    setError("")
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
                  placeholder="Enter ID"
                  disabled={isSubmitting || !trekId}
                />
                {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !trekId}
                className="mt-6 px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-1" /> Add
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Available services list */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            {filteredServices.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ? "No services match your search" : "No services available"}
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredServices.map((service) => {
                      const isSelected = selectedServices.some((s) => s.id === service.id)
                      return (
                        <tr
                          key={service.id}
                          className={`
                            ${isSelected ? "bg-green-50 dark:bg-green-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-600"} 
                            ${hoveredService === service.id ? "bg-gray-100 dark:bg-gray-600" : ""}
                            cursor-pointer transition-colors
                          `}
                          onMouseEnter={() => setHoveredService(service.id)}
                          onMouseLeave={() => setHoveredService(null)}
                          onClick={() => !isSelected && trekId && addServiceById(service.id)}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {service.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {service.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{service.description}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                            {isSelected ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <Check className="w-3 h-3 mr-1" /> Added
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addServiceById(service.id)
                                }}
                                disabled={isSubmitting || !trekId}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-[#ff5c5c] hover:bg-[#ff4040] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff5c5c] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-3 h-3 mr-1" /> Add
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Selected Services */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Selected Services</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {selectedServices.length} selected
            </span>
          </div>

          {selectedServices.length === 0 ? (
            <div className="p-8 bg-gray-50 dark:bg-gray-700 rounded-lg text-center border border-dashed border-gray-300 dark:border-gray-600">
              <p className="text-gray-600 dark:text-gray-400 mb-2">No services selected yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Click on a service from the left panel to add it to your trek
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-24rem)] overflow-y-auto pr-1">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center mb-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mr-2">
                        ID: {service.id}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{service.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{service.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeServiceFromTrek(service.id)}
                    disabled={isSubmitting}
                    className="p-2 text-gray-500 hover:text-white hover:bg-red-500 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Remove service"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

