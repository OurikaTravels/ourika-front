const API_BASE_URL = "http://localhost:8080/api"

const trekApi = {
  // Create a new trek (Step 1: Basic Info)
  createTrek: async (trekData) => {
    try {
      const token = localStorage.getItem("token")
      
      const response = await fetch(`${API_BASE_URL}/treks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(trekData),
      })
  
      if (!response.ok) {
        let errorMessage = "Failed to create trek"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
        }
        return { success: false, message: errorMessage }
      }
  
      const data = await response.json()
      console.log("Trek API response:", data)
      
      return {
        success: true,
        data: data.data,
        message: data.message || "Trek created successfully"
      }
    } catch (error) {
      console.error("Error in createTrek:", error)
      return { 
        success: false, 
        message: error.message || "Failed to create trek",
        error
      }
    }
  },

  // Get all treks
  getAllTreks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/treks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to fetch treks" }
      }

      const data = await response.json()
      // Check if data is an array, otherwise look for data in a nested property
      const treksArray = Array.isArray(data) ? data : data.data || []
      return { success: true, data: treksArray }
    } catch (error) {
      return { success: false, message: error.message || "Failed to fetch treks" }
    }
  },

  // Get a trek by ID
  getTrekById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/treks/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to fetch trek" }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      return { success: false, message: error.message || "Failed to fetch trek" }
    }
  },

  // Update a trek
  updateTrek: async (id, trekData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/treks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(trekData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to update trek" }
      }

      const data = await response.json()
      return { success: true, data, message: "Trek updated successfully" }
    } catch (error) {
      return { success: false, message: error.message || "Failed to update trek" }
    }
  },

  // Delete a trek
  deleteTrek: async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/treks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw { success: false, message: errorData.message || "Failed to delete trek" }
      }

      return { success: true, message: "Trek deleted successfully" }
    } catch (error) {
      return { success: false, message: error.message || "Failed to delete trek" }
    }
  },
}

export default trekApi

