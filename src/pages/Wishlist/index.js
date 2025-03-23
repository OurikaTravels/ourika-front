"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import wishlistApi from "../../services/wishlistApi";
import { toast } from "react-hot-toast";
import WishlistHeader from "./WishlistHeader";
import WishlistCard from "./WishlistCard";

const WishlistPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("dateAdded");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    priceRange: [0, 5000],
    duration: "all",
    rating: 0,
  });

  const formatDuration = (isoDuration) => {
    try {
      const hourMatch = isoDuration.match(/PT(\d+)H/);
      const minuteMatch = isoDuration.match(/(\d+)M/);
      const dayMatch = isoDuration.match(/P(\d+)D/);

      let result = "";

      if (dayMatch) {
        result += `${dayMatch[1]} day${dayMatch[1] > 1 ? "s" : ""} `;
      }

      if (hourMatch) {
        result += `${hourMatch[1]} hour${hourMatch[1] > 1 ? "s" : ""} `;
      }

      if (minuteMatch) {
        result += `${minuteMatch[1]} min`;
      }

      return result.trim() || "Duration not specified";
    } catch (error) {
      console.error("Error formatting duration:", error);
      return isoDuration;
    }
  };

  const fetchWishlist = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const response = await wishlistApi.getTouristWishlist(user.id);
      console.log("Raw Wishlist API response:", response);

      // Access the nested data array
      const wishlistItems = response.data?.data;
      
      if (response.success && Array.isArray(wishlistItems)) {
        console.log("Wishlist items:", wishlistItems);

        const transformedData = wishlistItems.map((item) => {
          console.log("Processing wishlist item:", item);

          // Ensure trek data exists
          if (!item || !item.trek) {
            console.warn("Invalid wishlist item:", item);
            return null;
          }

          const trek = item.trek;

          // Find primary image or first available image
          const primaryImage = trek.images?.find((img) => img.isPrimary)?.path ||
            (trek.images?.length > 0 ? trek.images[0].path : null);

          return {
            id: trek.id,
            title: trek.title || "No Title",
            type: trek.categoryId === 1 ? "DAY TRIP" : "MULTI-DAY",
            duration: formatDuration(trek.duration || "PT0H"),
            description: trek.description || "",
            pickup: trek.services?.some((service) =>
              service.name?.toLowerCase().includes("pickup")
            )
              ? "Pickup available"
              : "No pickup",
            rating: trek.rating || 4.5,
            reviews: trek.reviews || 0,
            imageUrl: primaryImage
              ? `http://localhost:8080/api/treks/${trek.id}/images/${primaryImage}`
              : "/placeholder.svg",
            discountedPrice: trek.price || 0,
            originalPrice: Math.round((trek.price || 0) * 1.2),
            currency: "MAD",
            addedDate: new Date(item.addedDate),
            highlights: trek.highlights || [],
            services: trek.services || [],
            startLocation: trek.startLocation,
            endLocation: trek.endLocation,
            trek: trek // Keep the original trek data
          };
        }).filter(Boolean); // Remove any null entries

        console.log("Final transformed data:", transformedData);
        setWishlist(transformedData);
      } else {
        setWishlist([]);
        toast.error(response.message || "Failed to fetch wishlist");
      }
    } catch (error) {
      toast.error("Failed to fetch wishlist");
      console.error("Wishlist fetch error:", error);
      setWishlist([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
    }
  }, [user?.id]);

  const removeFromWishlist = async (trekId) => {
    if (!user?.id) return;

    try {
      const response = await wishlistApi.removeFromWishlist(user.id, trekId);
      if (response.success) {
        setWishlist(wishlist.filter((item) => item.id !== trekId));
        toast.success("Removed from wishlist");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    }
  };

  // Filter and sort the wishlist
  const filteredAndSortedWishlist = wishlist
    .filter((item) => {
      if (filters.type !== "all" && item.type !== filters.type) return false;
      if (
        item.discountedPrice < filters.priceRange[0] ||
        item.discountedPrice > filters.priceRange[1]
      )
        return false;
      if (filters.rating > 0 && item.rating < filters.rating) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "dateAdded":
          return new Date(b.addedDate) - new Date(a.addedDate);
        case "priceAsc":
          return a.discountedPrice - b.discountedPrice;
        case "priceDesc":
          return b.discountedPrice - a.discountedPrice;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen">
      <WishlistHeader theme={theme} />

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredAndSortedWishlist.length > 0 ? (
          <div className="grid gap-6">
            {filteredAndSortedWishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                onRemove={removeFromWishlist}
                theme={theme}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#049769]/5 to-[#049769]/10 rounded-2xl p-10 border border-gray-200 shadow-sm max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-[#049769]/20 to-[#049769]/30 rounded-full flex items-center justify-center mb-8 border-2 border-[#049769]/30">
                <MapPin className="w-14 h-14 text-[#049769]" />
              </div>

              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Discover Ourika's Treasures
              </h2>
              <p className="text-gray-600 max-w-lg mb-10 text-lg">
                Embark on an unforgettable journey through Morocco's
                breathtaking landscapes. Explore our handpicked treks and create
                memories that will last a lifetime.
              </p>

              <Link
                to="/treks"
                className="group inline-flex items-center px-8 py-4 bg-[#049769] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="text-lg">Explore Ourika Treks</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
