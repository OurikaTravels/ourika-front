const API_BASE_URL = "http://localhost:8080/api"

const imageApi = {
  // Upload multiple images for a trek in bulk
  uploadTrekImages: async (trekId, files, onProgress) => {
    try {
      const token = localStorage.getItem("token")

      // Create FormData object
      const formData = new FormData()

      // Append each file to the FormData
      files.forEach((file) => {
        formData.append("file", file) // Field name must be "file"
      })

      // Explicitly set isPrimary to false for all images
      formData.append("isPrimary", "false") // Field name must be "isPrimary"

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.open("POST", `${API_BASE_URL}/treks/${trekId}/images/bulk`)

        // Set authorization header if token exists
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`)
        }

        // Handle response
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText)
              resolve({
                success: true,
                message: "Images uploaded successfully",
                data,
              })
            } catch (error) {
              reject({
                success: false,
                message: "Error parsing response",
                data: null,
              })
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText)
              let errorMessage = errorData.message || `Failed to upload images. Status: ${xhr.status}`

              // Check for specific error about minimum files
              if (xhr.status === 400 && errorMessage.includes("At least")) {
                errorMessage = "At least 4 files are required for upload."
              }

              reject({
                success: false,
                message: errorMessage,
                data: null,
              })
            } catch (error) {
              reject({
                success: false,
                message: `Failed to upload images. Status: ${xhr.status}`,
                data: null,
              })
            }
          }
        }

        // Handle network errors
        xhr.onerror = () => {
          reject({
            success: false,
            message: "Network error occurred during upload",
            data: null,
          })
        }

        // Handle progress if callback provided
        if (typeof onProgress === "function") {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100)
              onProgress(percentComplete)
            }
          }
        }

        // Send the request
        xhr.send(formData)
      })
    } catch (error) {
      console.error("Error uploading images:", error)
      return {
        success: false,
        message: error.message || "An error occurred while uploading images",
        data: null,
      }
    }
  },

  // Get all images for a trek
  getTrekImages: async (trekId) => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_BASE_URL}/treks/${trekId}/images`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          success: false,
          message: errorData.message || `Failed to fetch images. Status: ${response.status}`,
        }
      }

      const data = await response.json()
      // Check if data is an array, otherwise look for data in a nested property
      const imagesArray = Array.isArray(data) ? data : data.data || []
      return { success: true, data: imagesArray }
    } catch (error) {
      console.error("Error fetching images:", error)
      return {
        success: false,
        message: error.message || "An error occurred while fetching images",
        data: null,
      }
    }
  },

  // Delete an image from a trek
  deleteTrekImage: async (trekId, imageId) => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_BASE_URL}/treks/${trekId}/images/${imageId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          success: false,
          message: errorData.message || `Failed to delete image. Status: ${response.status}`,
        }
      }

      return { success: true, message: "Image deleted successfully" }
    } catch (error) {
      console.error("Error deleting image:", error)
      return {
        success: false,
        message: error.message || "An error occurred while deleting image",
      }
    }
  },

  // Toggle primary status of an image (POST request)
  toggleImagePrimaryStatus: async (trekId, imageId) => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(`${API_BASE_URL}/treks/${trekId}/images/${imageId}/primary`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          success: false,
          message: errorData.message || `Failed to toggle primary status. Status: ${response.status}`,
        }
      }

      const data = await response.json().catch(() => ({}))
      return {
        success: true,
        message: "Image primary status toggled successfully",
        data,
      }
    } catch (error) {
      console.error("Error toggling primary status:", error)
      return {
        success: false,
        message: error.message || "An error occurred while toggling primary status",
        data: null,
      }
    }
  },
}

export default imageApi

