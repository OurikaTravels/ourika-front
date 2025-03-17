const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api"

const postApi = {
  // Get all posts for a guide
  getGuidePosts: async (guideId) => {
    try {
      if (!guideId) {
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)
          guideId = user.id
        }

        if (!guideId) {
          return {
            success: false,
            message: "Guide ID is required but not provided",
            data: [],
          }
        }
      }

      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/posts/guides/${guideId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          message: errorData.message || `Failed to fetch posts. Status: ${response.status}`,
          data: [],
        }
      }

      const data = await response.json()
      return {
        success: true,
        message: "Posts fetched successfully",
        data,
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      return {
        success: false,
        message: error.message || "An error occurred while fetching posts",
        data: [],
      }
    }
  },

  // Create a new post for a guide
  createGuidePost: async (guideId, postData, images) => {
    try {
      if (!guideId) {
        const userData = localStorage.getItem("user")
        if (userData) {
          const user = JSON.parse(userData)
          guideId = user.id
        }

        if (!guideId) {
          return {
            success: false,
            message: "Guide ID is required but not provided",
            data: null,
          }
        }
      }

      const token = localStorage.getItem("token")

      const formData = new FormData()

      const postBlob = new Blob([JSON.stringify(postData)], {
        type: "application/json",
      })

      formData.append("post", postBlob)

      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append("images", image)
        })
      }

      const headers = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE_URL}/posts/guides/${guideId}`, {
        method: "POST",
        headers: headers,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          message: errorData.message || `Failed to create post. Status: ${response.status}`,
          data: null,
        }
      }

      const data = await response.json()
      return {
        success: true,
        message: "Post created successfully",
        data,
      }
    } catch (error) {
      console.error("Error creating post:", error)
      return {
        success: false,
        message: error.message || "An error occurred while creating the post",
        data: null,
      }
    }
  },


  // Delete a post
  deletePost: async (postId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          message: errorData.message || `Failed to delete post. Status: ${response.status}`,
        }
      }

      return {
        success: true,
        message: "Post deleted successfully",
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      return {
        success: false,
        message: error.message || "An error occurred while deleting the post",
      }
    }
  },

  // Get all posts
  getAllPosts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return {
          success: false,
          message: errorData.message || `Failed to fetch posts. Status: ${response.status}`,
          data: [],
        }
      }

      const data = await response.json()
      return {
        success: true,
        message: "Posts fetched successfully",
        data,
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      return {
        success: false,
        message: error.message || "An error occurred while fetching posts",
        data: [],
      }
    }
  },
}

export default postApi

