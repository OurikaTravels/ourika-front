import api from "./axiosConfig";

const touristApi = {
  getAllTourists: async () => {
    try {
      const response = await api.get("/users/tourists");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch tourists",
        data: [],
      };
    }
  },

  getTouristById: async (touristId) => {
    try {
      const response = await api.get(`/users/tourists/${touristId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch tourist details",
        data: null,
      };
    }
  },

  getTouristProfile: async (touristId) => {
    try {
      const response = await api.get(`/users/tourists/${touristId}/profile`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch tourist profile",
        data: null,
      };
    }
  },

  updateTouristProfile: async (touristId, profileData) => {
    try {
      const response = await api.patch(`/users/tourists/${touristId}/profile`, profileData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update tourist profile",
        data: null,
      };
    }
  },
};

export default touristApi;