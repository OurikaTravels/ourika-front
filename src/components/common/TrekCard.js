"use client"

import { useState, useEffect } from "react"
import { Heart, Star } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import wishlistApi from "../../services/wishlistApi"
import { toast } from "react-hot-toast"

const TrekCard = ({
  trekId,
  images = [],
  title = "From Marrakech: Ouzoud Waterfalls Guided Tour & Boat Ride",
  type = "DAY TRIP",
  duration = "10 hours",
  pickup = "Pickup available",
  rating = 4.6,
  reviews = 8951,
  price = 176,
  currency = "MAD",
  isFavorite = false,
  onWishlistUpdate,
}) => {
  const [isLiked, setIsLiked] = useState(isFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()
  const { user, isAuthenticated } = useAuth()

  const handleWishlistClick = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist")
      return
    }

    if (!user?.id || !trekId) {
      toast.error("Unable to process request")
      return
    }

    setIsLoading(true)
    try {
      if (!isLiked) {
        // Add to wishlist
        const response = await wishlistApi.addToWishlist(user.id, trekId)
        if (response.success) {
          setIsLiked(true)
          toast.success("Added to wishlist")
          if (onWishlistUpdate) onWishlistUpdate()
        } else {
          throw new Error(response.message)
        }
      } else {
        // Remove from wishlist
        const response = await wishlistApi.removeFromWishlist(user.id, trekId)
        if (response.success) {
          setIsLiked(false)
          toast.success("Removed from wishlist")
          if (onWishlistUpdate) onWishlistUpdate()
        } else {
          throw new Error(response.message)
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to update wishlist")
    } finally {
      setIsLoading(false)
    }
  }

  // Check if trek is in wishlist when component mounts
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user?.id || !trekId) return

      try {
        const response = await wishlistApi.getTouristWishlist(user.id)
        if (response.success && Array.isArray(response.data.wishlistItems)) {
          const isInWishlist = response.data.wishlistItems.some(
            item => item.trek.id === trekId
          )
          setIsLiked(isInWishlist)
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error)
      }
    }

    checkWishlistStatus()
  }, [user?.id, trekId])

  const primaryImage = images?.find(img => img.isPrimary) || images?.[0]
  const imageUrl = primaryImage 
    ? `http://localhost:8080/api/treks/${trekId}/images/${primaryImage.path}`
    : ''    
  const fullStars = Math.floor(rating)
  const decimal = rating % 1
  const percentage = Math.round(decimal * 100)

  return (
    <div className={`flex flex-col rounded-lg overflow-hidden transition-all duration-300 
      ${theme === "dark" 
        ? "bg-gray-800 border border-gray-700 hover:border-gray-600" 
        : "bg-white border border-gray-200 hover:border-gray-300"
      } hover:shadow-lg transform hover:-translate-y-1`}>
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden group">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg"
          }}
        />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-[11px] font-medium rounded-md 
            ${theme === "dark" 
              ? "bg-gray-900/90 text-gray-100" 
              : "bg-white/90 text-gray-700"
            } backdrop-blur-sm`}>
            {type}
          </span>
        </div>

        {/* Heart button */}
        <button
          onClick={handleWishlistClick}
          disabled={isLoading}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300
            ${theme === "dark"
              ? "bg-gray-900/20 hover:bg-gray-900/40"
              : "bg-gray-50/20 hover:bg-gray-50/40"
            } backdrop-blur-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300
              ${isLiked 
                ? "fill-[#ff4040] text-[#ff4040]" 
                : theme === "dark" 
                  ? "text-gray-200 hover:text-[#ff4040]" 
                  : "text-gray-700 hover:text-[#ff4040]"
              }`}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col p-4 gap-2.5">
        <h3 className={`font-medium text-[15px] leading-5 
            ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
            {type}
        </h3>
        <h3 className={`font-medium text-xl leading-5 
          ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
          {title}
        </h3>

        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {duration} • {pickup}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-[14px] h-[14px] ${
                  i < fullStars
                    ? "fill-[#FFB800] text-[#FFB800]"
                    : i === fullStars && decimal > 0
                      ? `fill-[#FFB800] text-[#FFB800]`
                      : theme === "dark"
                        ? "fill-gray-700 text-gray-700"
                        : "fill-gray-200 text-gray-200"
                }`}
                style={
                  i === fullStars && decimal > 0
                    ? {
                        clipPath: `inset(0 ${100 - percentage}% 0 0)`,
                      }
                    : undefined
                }
              />
            ))}
          </div>
          <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {rating} ({reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className={`text-base font-medium 
            ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
            From {price.toLocaleString()}
          </span>
          <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {currency} per person
          </span>
        </div>
      </div>
    </div>
  )
}

export default TrekCard

