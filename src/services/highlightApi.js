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

  // Add a highlight to a trek
  addHighlightToTrek: async (trekId, highlightId) => {
    try {
      const token = localStorage.getItem("token")
      console.log("API call params:", { trekId, highlightId, token: !!token })
      
      const response = await fetch(`${API_BASE_URL}/treks/${trekId}/highlights/${highlightId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })
  
      console.log("API response status:", response.status)
      
      if (!response.ok) {
        let errorMessage = "Failed to add highlight to trek"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
        }
        throw { success: false, message: errorMessage }
      }
  
      return { success: true, message: "Highlight added to trek successfully" }
    } catch (error) {
      console.error("Error in addHighlightToTrek:", error)
      return { 
        success: false, 
        message: error.message || "Failed to add highlight to trek",
        error
      }
    }
  },

  // Remove a highlight from a trek
  removeHighlightFromTrek: async (trekId, highlightId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/treks/${trekId}/highlights/${highlightId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to remove highlight from trek" }
      }

      return { success: true, message: "Highlight removed from trek successfully" }
    } catch (error) {
      return { success: false, message: error.message || "Failed to remove highlight from trek" }
    }
  },
}

export default highlightApi

