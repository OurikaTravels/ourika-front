const API_BASE_URL = "http://localhost:8080/api"

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      return data
    } catch (error) {
      throw new Error(error.message || "Network error")
    }
  },

  isTokenExpired: (token) => {
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const expirationTime = payload.exp * 1000 
      return Date.now() >= expirationTime
    } catch (error) {
      return true
    }
  },
}

