import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";
const IMAGES_BASE_URL = "http://localhost:8080/api/uploads/images";

const trekApi = {
  // Create a new trek 
  createTrek: async (trekData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/treks`, trekData, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Trek created successfully",
      };
    } catch (error) {
      console.error("Error in createTrek:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create trek",
        error,
      };
    }
  },

  // Get all treks
  getAllTreks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/treks`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if data is an array, otherwise look for data in a nested property
      const treksArray = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];
      return { success: true, data: treksArray };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch treks",
      };
    }
  },

  // Get a trek by ID
  getTrekById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/treks/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch trek",
      };
    }
  },

  // Update a trek
  updateTrek: async (id, trekData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE_URL}/treks/${id}`, trekData, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return {
        success: true,
        data: response.data,
        message: "Trek updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update trek",
      };
    }
  },

  // Delete a trek
  deleteTrek: async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${API_BASE_URL}/treks/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      return { success: true, message: "Trek deleted successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete trek",
      };
    }
  },

  // Get treks by category ID
  getTreksByCategory: async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/treks/category/${categoryId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : response.data.data || [],
      };
    } catch (error) {
      console.error("Error in getTreksByCategory:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch treks by category",
        data: [],
      };
    }
  },

  // Search treks
  searchTreks: async (query) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/treks/search?title=${encodeURIComponent(query)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return {
        success: true,
        data: response.data.map((trek) => ({
          ...trek,
          primaryImageUrl: trek.primaryImageUrl
            ? `${IMAGES_BASE_URL}/${trek.primaryImageUrl.split("/").pop()}`
            : null,
        })),
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to search treks",
        data: [],
      };
    }
  },
};

export default trekApi;