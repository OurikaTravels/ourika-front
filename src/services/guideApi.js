const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api'

const guideApi = {
  // Get all guides
  getAllGuides: async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/guides`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { 
          success: false, 
          message: errorData.message || "Failed to fetch guides" 
        }
      }

      const data = await response.json()
      // Return the entire response as it matches the API structure
      return data
    } catch (error) {
      console.error("Error fetching guides:", error)
      return { 
        success: false, 
        message: error.message || "Failed to fetch guides",
        data: [] 
      }
    }
  },

  // Get guides ordered by reservation date
  getGuidesOrderedByReservationDate: async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/guides/ordered-by-reservation-date`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
      return { 
        success: false, 
        message: errorData.message || "Failed to fetch guides" 
      }
    }

    const data = await response.json()
    // Return the entire response as it matches the API structure
    return data
  } catch (error) {
    console.error("Error fetching guides by reservation:", error)
    return { 
      success: false, 
      message: error.message || "Failed to fetch guides",
      data: [] 
    }
  }
},

  // toggleGuideValidation
  toggleGuideValidation: async (guideId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/auth/validate-guide/${guideId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { 
          success: false, 
          message: errorData.message || "Failed to toggle guide validation status" 
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Error toggling guide validation:", error)
      return { 
        success: false, 
        message: error.message || "Failed to toggle guide validation status" 
      }
    }
  },

  // Add the getGuideById function
  getGuideById: async (guideId) => {
    if (!guideId || isNaN(guideId)) {
      return {
        success: false,
        message: "Invalid guide ID"
      }
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/guides/${guideId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { 
          success: false, 
          message: errorData.message || "Failed to fetch guide details" 
        }
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error("Error fetching guide details:", error)
      return { 
        success: false, 
        message: error.message || "Failed to fetch guide details" 
      }
    }
  },

  // Get guide profile by ID
  getGuideProfile: async (guideId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/guides/${guideId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          message: errorData.message || "Failed to fetch guide profile"
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching guide profile:", error)
      return {
        success: false,
        message: error.message || "Failed to fetch guide profile"
      }
    }
  },

  // Update guide profile
  updateGuideProfile: async (guideId, profileData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/guides/${guideId}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(profileData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          message: errorData.message || "Failed to update guide profile"
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error updating guide profile:", error)
      return {
        success: false,
        message: error.message || "Failed to update guide profile"
      }
    }
  },

  uploadProfileImage: async (guideId, imageFile) => {
    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("file", imageFile)

      const response = await fetch(`${API_BASE_URL}/auth/upload-profile-image/${guideId}`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          success: false,
          message: errorData.message || "Failed to upload profile image"
        }
      }

      const data = await response.json()
      return {
        success: true,
        data
      }
    } catch (error) {
      console.error("Error uploading profile image:", error)
      return {
        success: false,
        message: error.message || "Failed to upload profile image"
      }
    }
  }
}

export default guideApi
