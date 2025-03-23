const API_BASE_URL = "http://localhost:8080/api";

const wishlistApi = {
  addToWishlist: async (touristId, trekId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/wishlists/tourists/${touristId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ trekId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to wishlist");
      }

      // Get updated count after adding
      const countResponse = await wishlistApi.getWishlistCount(touristId);
      return { 
        success: true,
        count: countResponse.count 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || "Failed to add to wishlist",
        count: 0
      };
    }
  },

  removeFromWishlist: async (touristId, trekId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/wishlists/tourists/${touristId}/remove/${trekId}`,
        {
          method: "DELETE",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from wishlist");
      }

      // Get updated count after removing
      const countResponse = await wishlistApi.getWishlistCount(touristId);
      return { 
        success: true,
        count: countResponse.count 
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to remove from wishlist",
        count: 0
      };
    }
  },

  getTouristWishlist: async (touristId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/wishlists/tourists/${touristId}`, {
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text(); 
      if (!text) {
        return {
          success: true,
          message: "No wishlist items found",
          data: { wishlistItems: [] }
        };
      }

      const responseData = JSON.parse(text); // Then parse it
      console.log("Wishlist API response:", responseData);

      return {
        success: true,
        message: "Wishlist retrieved",
        data: responseData
      };
    } catch (error) {
      console.error("API error:", error);
      return {
        success: false,
        message: error.message || "Failed to fetch wishlist",
        data: { wishlistItems: [] }
      };
    }
  },

  getWishlistCount: async (touristId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/wishlists/count/${touristId}`, {
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        count: data
      };
    } catch (error) {
      console.error("API error:", error);
      return {
        success: false,
        count: 0,
        message: error.message || "Failed to fetch wishlist count"
      };
    }
  },

  getTouristWishlistTrekIds: async (touristId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/wishlists/trek-ids/${touristId}`, {
        headers: {
          "Accept": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error("API error:", error);
      return {
        success: false,
        data: [],
        message: error.message || "Failed to fetch wishlist trek IDs"
      };
    }
  }
};

export default wishlistApi;
