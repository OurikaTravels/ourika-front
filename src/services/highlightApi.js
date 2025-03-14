const API_BASE_URL = "http://localhost:8080/api"

const highlightApi = {
  // Get all highlights
  getAllHighlights: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/highlights`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to fetch highlights" }
      }

      const data = await response.json()
      // Check if data is an array, otherwise look for data in a nested property
      const highlightsArray = Array.isArray(data) ? data : data.data || []
      return { success: true, data: highlightsArray }
    } catch (error) {
      return { success: false, message: error.message || "Failed to fetch highlights" }
    }
  },

  // Create a new highlight
  createHighlight: async (highlightData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/highlights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(highlightData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to create highlight" }
      }

      const data = await response.json()
      return data
    } catch (error) {
      return { success: false, message: error.message || "Failed to create highlight" }
    }
  },

  // Update a highlight
  updateHighlight: async (id, highlightData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/highlights/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(highlightData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to update highlight" }
      }

      const data = await response.json()
      return { success: true, data, message: "Highlight updated successfully" }
    } catch (error) {
      return { success: false, message: error.message || "Failed to update highlight" }
    }
  },

  // Delete a highlight
  deleteHighlight: async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/highlights/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to delete highlight" }
      }

      return { success: true, message: "Highlight deleted successfully" }
    } catch (error) {
      return { success: false, message: error.message || "Failed to delete highlight" }
    }
  },
}

export default highlightApi

