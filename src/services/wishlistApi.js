import api from "./axiosConfig";

const wishlistApi = {
  addToWishlist: async (touristId, trekId) => {
    try {
      const response = await api.post(`/wishlists/tourists/${touristId}/add`, { trekId });
      const countResponse = await wishlistApi.getWishlistCount(touristId);
      return {
        success: true,
        count: countResponse.count,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add to wishlist",
        count: 0,
      };
    }
  },

  removeFromWishlist: async (touristId, trekId) => {
    try {
      await api.delete(`/wishlists/tourists/${touristId}/remove/${trekId}`);
      const countResponse = await wishlistApi.getWishlistCount(touristId);
      return {
        success: true,
        count: countResponse.count,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove from wishlist",
        count: 0,
      };
    }
  },

  getTouristWishlist: async (touristId) => {
    try {
      const response = await api.get(`/wishlists/tourists/${touristId}`);
      return {
        success: true,
        message: "Wishlist retrieved",
        data: response.data || { wishlistItems: [] },
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch wishlist",
        data: { wishlistItems: [] },
      };
    }
  },

  getWishlistCount: async (touristId) => {
    try {
      const response = await api.get(`/wishlists/count/${touristId}`);
      return {
        success: true,
        count: response.data,
      };
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: error.response?.data?.message || "Failed to fetch wishlist count",
      };
    }
  },

  getTouristWishlistTrekIds: async (touristId) => {
    try {
      const response = await api.get(`/wishlists/trek-ids/${touristId}`);
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: error.response?.data?.message || "Failed to fetch wishlist trek IDs",
      };
    }
  },
};

export default wishlistApi;