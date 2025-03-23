import api from "./axiosConfig";

const guideApi = {
  getAllGuides: async () => {
    try {
      const response = await api.get("/users/guides");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch guides",
        data: [],
      };
    }
  },

  getGuidesOrderedByReservationDate: async () => {
    try {
      const response = await api.get("/users/guides/ordered-by-reservation-date");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch guides",
        data: [],
      };
    }
  },

  toggleGuideValidation: async (guideId) => {
    try {
      const response = await api.patch(`/auth/validate-guide/${guideId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to toggle guide validation status",
      };
    }
  },

  getGuideById: async (guideId) => {
    if (!guideId || isNaN(guideId)) {
      return {
        success: false,
        message: "Invalid guide ID",
      };
    }

    try {
      const response = await api.get(`/users/guides/${guideId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch guide details",
      };
    }
  },

  getGuideProfile: async (guideId) => {
    try {
      const response = await api.get(`/users/guides/${guideId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch guide profile",
      };
    }
  },

  updateGuideProfile: async (guideId, profileData) => {
    try {
      const response = await api.patch(`/users/guides/${guideId}/profile`, profileData);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update guide profile",
      };
    }
  },

  uploadProfileImage: async (guideId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await api.post(`/auth/upload-profile-image/${guideId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to upload profile image",
      };
    }
  },
};

export default guideApi;