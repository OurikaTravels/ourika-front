"use client"

import { useState, useEffect } from "react"
import { Plus, X, Loader, Check, AlertCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import serviceApi from "../../services/serviceApi"

export default function ServiceSelector({ trekId, availableServices, selectedServices, setSelectedServices }) {
  const [isLoading, setIsLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newServiceName, setNewServiceName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredService, setHoveredService] = useState(null)

  useEffect(() => {
    if (trekId) {
      fetchTrekServices()
    }
  }, [trekId])

  const fetchTrekServices = async () => {
    setIsLoading(true)
    try {
      const response = await serviceApi.getAllServices()
      if (response.success) {
        setIsLoading(false)
      } else {
        throw new Error(response.message || "Failed to fetch trek services")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching trek services")
      setIsLoading(false)
    }
  }

  const handleToggleService = async (service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id)

    try {
      if (isSelected) {
        const response = await serviceApi.removeServiceFromTrek(trekId, service.id)
        if (response.success) {
          setSelectedServices(selectedServices.filter((s) => s.id !== service.id))
          toast.success(`${service.name} removed from trek`)
        } else {
          throw new Error(response.message || "Failed to remove service")
        }
      } else {
        const response = await serviceApi.addServiceToTrek(trekId, service.id)
        if (response.success) {
          setSelectedServices([...selectedServices, service])
          toast.success(`${service.name} added to trek`)
        } else {
          throw new Error(response.message || "Failed to add service")
        }
      }
    } catch (err) {
      toast.error(err.message || "An error occurred")
    }
  }

  const handleAddNewService = async (e) => {
    e.preventDefault()

    if (!newServiceName.trim()) {
      setError("Service name is required")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await serviceApi.createService({ name: newServiceName.trim() })
      if (response.success) {
        const newService = response.data

        const addToTrekResponse = await serviceApi.addServiceToTrek(trekId, newService.id)
        if (addToTrekResponse.success) {
          setSelectedServices([...selectedServices, newService])
        }

        availableServices.push(newService)

        toast.success(`${newService.name} created and added to trek`)
        setNewServiceName("")
        setShowAddModal(false)
      } else {
        throw new Error(response.message || "Failed to create service")
      }
    } catch (err) {
      setError(err.message || "An error occurred while creating the service")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredServices = availableServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Select Services</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-3 py-1.5 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add New Service
        </button>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search services..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-700 rounded-lg bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader className="w-8 h-8 text-[#fe5532] animate-spin" />
          <span className="ml-2 text-gray-400">Loading services...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => {
            const isSelected = selectedServices.some((s) => s.id === service.id)
            return (
              <div
                key={service.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-[#fe5532]/10 border-[#fe5532] text-white"
                    : "bg-[#232630] border-gray-700 text-gray-300 hover:border-[#fe5532]/50"
                }`}
                onClick={() => handleToggleService(service)}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{service.name}</span>
                  {isSelected && <Check className="w-5 h-5 text-[#fe5532]" />}
                </div>
              </div>
            )
          })}
        </div>
      )}

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

            {error && (
              <div className="mb-4 p-3 bg-[#fe5532]/10 border-l-4 border-[#fe5532] text-[#fe5532] rounded flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddNewService}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="serviceName" className="block text-sm font-medium text-gray-300 mb-1">
                    Service Name <span className="text-[#fe5532]">*</span>
                  </label>
                  <input
                    type="text"
                    id="serviceName"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent"
                    placeholder="Enter service name"
                  />
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

      <div className="mt-6 bg-[#232630] rounded-lg p-4 border border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-medium text-white">Selected Services ({selectedServices.length})</h4>
        </div>
        {selectedServices.length === 0 ? (
          <p className="text-gray-400 text-sm">No services selected yet. Click on services above to select them.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center bg-[#191b20] text-white px-3 py-1.5 rounded-full text-sm"
              >
                {service.name}
                <button
                  onClick={() => handleToggleService(service)}
                  className="ml-2 text-gray-400 hover:text-[#fe5532]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

