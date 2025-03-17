const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

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
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching tourists:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch tourists",
        data: [],
      };
    }
  },
};

export default touristApi;