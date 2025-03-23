
const API_BASE_URL = "http://localhost:8080/api"


const adminApi = {
  getAdminStatistics: async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/users/admin/statistics`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch admin statistics")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching admin statistics:", error)
      return {
        success: false,
        message: error.message || "An error occurred while fetching statistics",
      }
    }
  },
}

export default adminApi