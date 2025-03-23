import api from "./axiosConfig";

const postApi = {
  getAllPosts: async () => {
    try {
      const response = await api.get("/posts");
      return {
        success: true,
        data: response.data,
        message: "Posts fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Failed to fetch posts",
      };
    }
  },

  getPostById: async (postId) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return {
        success: true,
        data: response.data,
        message: "Post fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || "Failed to fetch post",
      };
    }
  },

  toggleLike: async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/likes`, {});
      return {
        success: true,
        data: response.data,
        message: "Post like toggled successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to toggle like",
      };
    }
  },

  addComment: async (postId, content) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { content });
      return {
        success: true,
        data: response.data,
        message: "Comment added successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add comment",
      };
    }
  },

  createGuidePost: async (guideId, formData) => {
    try {
      const response = await api.post(`/posts/guides/${guideId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        success: true,
        data: response.data,
        message: "Post created successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create post",
      };
    }
  },

  getGuidePosts: async (guideId) => {
    try {
      const response = await api.get(`/posts/guides/${guideId}`);
      return {
        success: true,
        data: response.data,
        message: "Guide posts fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Failed to fetch guide posts",
      };
    }
  },

  getLikedPosts: async (userId) => {
    try {
      const response = await api.get(`/posts/liked-posts/${userId}`);
      return {
        success: true,
        data: response.data,
        message: "Liked posts fetched successfully",
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Failed to fetch liked posts",
      };
    }
  },

  deletePost: async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);
      return {
        success: true,
        message: "Post deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete post",
      };
    }
  },
};

export default postApi;