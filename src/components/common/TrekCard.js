"use client"

import { useState, useEffect } from "react"
import { Heart, Clock, MapPin } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import wishlistApi from "../../services/wishlistApi"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"

// Helper function to format duration
const formatDuration = (duration) => {
  if (!duration) return "Duration not specified"

  // If duration is already formatted, return it
  if (typeof duration === "string" && (duration.includes("hour") || duration.includes("day"))) {
    return duration
  }

  // Try to parse duration as a number of hours
  const hours = Number.parseInt(duration)
  if (isNaN(hours)) return duration

  if (hours < 24) {
    return hours === 1 ? "1 hour" : `${hours} hours`
  } else {
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    if (remainingHours === 0) {
      return days === 1 ? "1 day" : `${days} days`
    } else {
      return days === 1 ? `1 day ${remainingHours} hr` : `${days} days ${remainingHours} hr`
    }
  }
}

const TrekCard = ({
  trekId,
  images = [],
  title = "From Marrakech: Ouzoud Waterfalls Guided Tour & Boat Ride",
  type = "DAY TRIP",
  duration = "10 hours",
  pickup = "Pickup available",
  price = 176,
  currency = "MAD",
  isFavorite = false,
  onWishlistUpdate,
}) => {
  const [isLiked, setIsLiked] = useState(isFavorite)
  const [isLoading, setIsLoading] = useState(false)
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
          const isInWishlist = response.data.wishlistItems.some((item) => item.trek.id === trekId)
          setIsLiked(isInWishlist)
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error)
      }
    }

    checkWishlistStatus()
  }, [user?.id, trekId])

  const primaryImage = images?.find((img) => img.isPrimary) || images?.[0]
  const imageUrl = primaryImage ? `http://localhost:8080/api/uploads/images/${primaryImage.path}` : ""

  const formattedDuration = formatDuration(duration)

  return (
    <Link to={`/treks/${trekId}`} className="block group">
      <div
        className="flex flex-col rounded-xl overflow-hidden transition-all duration-300 
        bg-white border border-gray-100 group-hover:border-[#ff5c5c] group-hover:shadow-xl transform group-hover:-translate-y-2"
      >
        {/* Image container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg"
            }}
          />

          {/* Type badge */}
          <div className="absolute top-4 left-4">
            <span
              className="px-3 py-1.5 text-xs font-semibold rounded-full 
              bg-[#ff5c5c]/90 text-white backdrop-blur-sm shadow-lg"
            >
              {type}
            </span>
          </div>

          {/* Heart button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleWishlistClick()
            }}
            disabled={isLoading}
            className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300
              ${
                isLiked ? "bg-[#ff5c5c] text-white" : "bg-white/90 text-gray-700 hover:bg-[#ff5c5c]/90 hover:text-white"
              } 
              backdrop-blur-sm shadow-lg transform group-hover:scale-110
              ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-300
                ${isLiked ? "fill-white" : "group-hover:fill-white"}`}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col p-5 gap-3">
          <div className="space-y-2">
            <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-[#ff5c5c] transition-colors duration-300">
              {title}
            </h3>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-[#ff5c5c]" />
                <span className="text-sm">{formattedDuration}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-[#ff5c5c]" />
                <span className="text-sm">{pickup}</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-2 pt-3 border-t border-gray-100">
            <span className="text-xl font-bold text-[#ff5c5c]">{price.toLocaleString()}</span>
            <span className="text-sm text-gray-600">
              {currency} <span className="text-xs">per person</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default TrekCard

