const API_BASE_URL = "http://localhost:8080/api";

const touristApi = {
  getAllTourists: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/tourists`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Failed to fetch tourists",
          data: []
        };
      }

      const data = await response.json();
      return data; // Return the complete response object {success, message, data}
    } catch (error) {
      console.error("Error fetching tourists:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tourists",
        data: []
      };
    }
  },

  getTouristById: async (touristId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/tourists/${touristId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Failed to fetch tourist details",
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching tourist details:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tourist details",
        data: null,
      };
    }
  },

  getTouristProfile: async (touristId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/tourists/${touristId}/profile`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Failed to fetch tourist profile",
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching tourist profile:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tourist profile",
        data: null,
      };
    }
  },

  updateTouristProfile: async (touristId, profileData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/tourists/${touristId}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Failed to update tourist profile",
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error("Error updating tourist profile:", error);
      return {
        success: false,
        message: error.message || "Failed to update tourist profile",
        data: null,
      };
    }
  },
};

export default touristApi;
