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

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || "Failed to add to wishlist" 
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

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Failed to remove from wishlist"
      };
    }
  },


getTouristWishlist: async (touristId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/wishlists/tourists/${touristId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch wishlist");
    }

    const responseData = await response.json();
    console.log("Raw API response:", responseData); 
    
   
    return { 
      success: responseData.success || true, 
      message: responseData.message || "Wishlist retrieved", 
      data: responseData.data || [] 
    };
  } catch (error) {
    console.error("API error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch wishlist",
      data: []
    };
  }
}
};

export default wishlistApi;