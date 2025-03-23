import api from "./axiosConfig";

const reservationApi = {
  getAllReservations: async () => {
    try {
      const response = await api.get("/reservations");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while fetching reservations",
        data: [],
      };
    }
  },

  getReservationStatistics: async () => {
    try {
      const response = await api.get("/reservations/statistics");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while fetching reservation statistics",
        data: null,
      };
    }
  },

  approveReservation: async (reservationId) => {
    try {
      const response = await api.patch(`/reservations/${reservationId}/approve`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while approving the reservation",
      };
    }
  },

  assignGuideToReservation: async (reservationId, guideId) => {
    try {
      const response = await api.patch(`/reservations/${reservationId}/assign-guide`, { guideId });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while assigning the guide",
      };
    }
  },

  cancelReservation: async (reservationId) => {
    try {
      const response = await api.patch(`/reservations/${reservationId}/cancel`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while canceling the reservation",
      };
    }
  },

  getUpcomingReservations: async (guideId) => {
    try {
      const response = await api.get(`/reservations/notify-guide/${guideId}`);
      return {
        success: true,
        message: "Upcoming reservations fetched successfully",
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while fetching upcoming reservations",
        data: [],
      };
    }
  },

  createReservation: async (touristId, reservationData) => {
    try {
      const response = await api.post(`/reservations/tourists/${touristId}/reserve`, reservationData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while creating the reservation",
      };
    }
  },

  getTouristReservations: async (touristId) => {
    try {
      const response = await api.get(`/reservations/tourist/${touristId}`);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while fetching tourist reservations",
        data: [],
      };
    }
  },

  getReservationCount: async (touristId) => {
    try {
      const response = await api.get(`/reservations/count/${touristId}`);
      return {
        success: true,
        count: response.data,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: error.response?.data?.message || "Failed to fetch reservation count",
      };
    }
  },
};

export default reservationApi;