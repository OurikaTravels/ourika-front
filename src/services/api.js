import api from "./axiosConfig";

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Network error");
    }
  },

  registerGuide: async (guideData) => {
    try {
      const response = await api.post("/auth/register/guide", guideData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Network error");
    }
  },

  registerTourist: async (TouristData) => {
    try {
      const response = await api.post("/auth/register/tourist", TouristData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Network error");
    }
  },

  isTokenExpired: (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      return true;
    }
  },
};