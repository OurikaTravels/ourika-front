import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api"

const postApi = {

  getAllPosts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      return {
        success: true,
        data: response.data,
        message: "Posts fetched successfully",
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Failed to fetch posts",
      }
    }
  },


  getPostById: async (postId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      return {
        success: true,
        data: response.data,
        message: "Post fetched successfully",
      }
    } catch (error) {
      console.error(`Error fetching post ${postId}:`, error)
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to fetch post",
      }
    }
  },


  toggleLike: async (postId) => {
    try {
      // Check if the API endpoint follows a different pattern
      // Many APIs use /api/posts/{postId}/likes instead of /like
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      return {
        success: true,
        data: response.data,
        message: "Post like toggled successfully",
      }
    } catch (error) {
      console.error(`Error toggling like for post ${postId}:`, error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to toggle like",
      }
    }
  },


  addComment: async (postId, content) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/posts/${postId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      return {
        success: true,
        data: response.data,
        message: "Comment added successfully",
      }
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add comment",
      }
    }
  },


  createPost: async (postData) => {
    try {
      const formData = new FormData()

      formData.append("title", postData.title)
      formData.append("description", postData.description)

      if (postData.images && postData.images.length > 0) {
        postData.images.forEach((image) => {
          formData.append("images", image)
        })
      }

      const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      return {
        success: true,
        data: response.data,
        message: "Post created successfully",
      }
    } catch (error) {
      console.error("Error creating post:", error)
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create post",
      }
    }
  },
}

export default postApi

