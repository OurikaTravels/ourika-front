import api from "./axiosConfig";

const highlightApi = {
  getAllHighlights: async () => {
    try {
      const response = await api.get("/highlights");
      const highlightsArray = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return { success: true, data: highlightsArray };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch highlights" };
    }
  },

  createHighlight: async (highlightData) => {
    try {
      const response = await api.post("/highlights", highlightData);
      return response.data;
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to create highlight" };
    }
  },

  updateHighlight: async (id, highlightData) => {
    try {
      const response = await api.put(`/highlights/${id}`, highlightData);
      return { success: true, data: response.data, message: "Highlight updated successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to update highlight" };
    }
  },

  deleteHighlight: async (id) => {
    try {
      await api.delete(`/highlights/${id}`);
      return { success: true, message: "Highlight deleted successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to delete highlight" };
    }
  },

  addHighlightToTrek: async (trekId, highlightId) => {
    try {
      const response = await api.post(`/treks/${trekId}/highlights/${highlightId}`);
      return { success: true, message: "Highlight added to trek successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add highlight to trek",
        error,
      };
    }
  },

  removeHighlightFromTrek: async (trekId, highlightId) => {
    try {
      await api.delete(`/treks/${trekId}/highlights/${highlightId}`);
      return { success: true, message: "Highlight removed from trek successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to remove highlight from trek" };
    }
  },
};

export default highlightApi;