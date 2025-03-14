const API_BASE_URL = "http://localhost:8080/api"

const serviceApi = {
  // Get all services
  getAllServices: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to fetch services" }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, message: error.message || "Failed to fetch services" }
    }
  },

  // Create a new service
  createService: async (serviceData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(serviceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to create service" }
      }

      const data = await response.json()
      return { success: true, data, message: "Service created successfully" }
    } catch (error) {
      return { success: false, message: error.message || "Failed to create service" }
    }
  },

  // Update a service
  updateService: async (id, serviceData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(serviceData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to update service" }
      }

      const data = await response.json()
      return { success: true, data, message: "Service updated successfully" }
    } catch (error) {
      return { success: false, message: error.message || "Failed to update service" }
    }
  },

  // Delete a service
  deleteService: async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to delete service" }
      }

      return { success: true, message: "Service deleted successfully" }
    } catch (error) {
      return { success: false, message: error.message || "Failed to delete service" }
    }
  },
}

export default serviceApi

