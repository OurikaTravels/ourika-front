import api from "./axiosConfig";

const adminApi = {
  getAdminStatistics: async () => {
    try {
      const response = await api.get("/users/admin/statistics");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while fetching statistics",
      };
    }
  },
};

export default adminApi;