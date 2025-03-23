import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const reservationApi = {
  // Get all reservations
  getAllReservations: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message ||
            `Failed to fetch reservations. Status: ${response.status}`,
          data: [],
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      return {
        success: false,
        message:
          error.message || "An error occurred while fetching reservations",
        data: [],
      };
    }
  },

  // Get reservation statistics
  getReservationStatistics: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/reservations/statistics`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message ||
            `Failed to fetch reservation statistics. Status: ${response.status}`,
          data: null,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching reservation statistics:", error);
      return {
        success: false,
        message:
          error.message ||
          "An error occurred while fetching reservation statistics",
        data: null,
      };
    }
  },

  // Approve a reservation
  approveReservation: async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message ||
            `Failed to approve reservation. Status: ${response.status}`,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error approving reservation:", error);
      return {
        success: false,
        message:
          error.message || "An error occurred while approving the reservation",
      };
    }
  },

  // Assign a guide to a reservation
  assignGuideToReservation: async (reservationId, guideId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}/assign-guide`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ guideId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message ||
            `Failed to assign guide. Status: ${response.status}`,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error assigning guide:", error);
      return {
        success: false,
        message: error.message || "An error occurred while assigning the guide",
      };
    }
  },

  // Cancel a reservation
  cancelReservation: async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message:
            errorData.message ||
            `Failed to cancel reservation. Status: ${response.status}`,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error canceling reservation:", error);
      return {
        success: false,
        message:
          error.message || "An error occurred while canceling the reservation",
      };
    }
  },

  //Upcoming Reservations

  getUpcomingReservations: async (guideId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/reservations/notify-guide/${guideId}`,
        {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch reservations. Status: ${response.status}`
        );
      }

      const data = await response.json();
      return {
        success: true,
        message: "Upcoming reservations fetched successfully",
        data,
      };
    } catch (error) {
      console.error("Error fetching upcoming reservations:", error);
      return {
        success: false,
        message:
          error.message ||
          "An error occurred while fetching upcoming reservations",
        data: [],
      };
    }
  },

  createReservation: async (touristId, reservationData) => {
    try {
      const token = localStorage.getItem("token");
      const response = axios.post(
        `${API_BASE_URL}/reservations/tourists/${touristId}/reserve`,
        reservationData,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
console.log(response.data)
      return { success: true, data:response.data };

    } catch (error) {
      console.error("Error creating reservation:", error);
      return {
        success: false,
        message:
          error.response?.data?.message||
          error.message || "An error occurred while creating the reservation",
      };
    }
  },

  getTouristReservations: async (touristId) => {
    try {
      const token = localStorage.getItem("token");
  
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.get(
        `${API_BASE_URL}/reservations/tourist/${touristId}`,
        { headers }
      );
  
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error fetching tourist reservations:", error);
  
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching tourist reservations",
        data: [],
      };
    }
  },
};

export default reservationApi;
