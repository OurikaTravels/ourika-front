import api from "./axiosConfig";

const IMAGES_BASE_URL = "http://localhost:8080/api/uploads/images";

const trekApi = {
  createTrek: async (trekData) => {
    try {
      const response = await api.post("/treks", trekData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Trek created successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create trek",
        error,
      };
    }
  },

  getAllTreks: async () => {
    try {
      const response = await api.get("/treks");

      const treksArray = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      const processedTreks = treksArray.map((trek) => ({
        ...trek,
        duration: trek.duration || trek.formattedDuration || "PT8H",
      }));

      return { success: true, data: processedTreks };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch treks",
        data: [],
      };
    }
  },

  getTrekById: async (id) => {
    try {
      const response = await api.get(`/treks/${id}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch trek",
      };
    }
  },

  updateTrek: async (id, trekData) => {
    try {
      const response = await api.put(`/treks/${id}`, trekData);
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

  deleteTrek: async (id) => {
    try {
      await api.delete(`/treks/${id}`);
      return { success: true, message: "Trek deleted successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete trek",
      };
    }
  },

  getTreksByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/treks/category/${categoryId}`);
      return {
        success: true,
        data: Array.isArray(response.data) ? response.data : response.data.data || [],
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch treks by category",
        data: [],
      };
    }
  },

  searchTreks: async (query) => {
    try {
      const response = await api.get(`/treks/search?title=${encodeURIComponent(query)}`);
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