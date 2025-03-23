"use client"

import { useState, useEffect } from "react"
import { Heart, Clock, MapPin } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useWishlist } from "../../context/WishlistContext"
import wishlistApi from "../../services/wishlistApi"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"

const formatDuration = (duration) => {
  if (!duration || typeof duration !== "string") {
    return "Duration not specified"
  }

  try {
    const hoursMatch = duration.match(/(\d+)H/)
    const minutesMatch = duration.match(/(\d+)M/)

    const hours = hoursMatch ? Number.parseInt(hoursMatch[1]) : 0
    const minutes = minutesMatch ? Number.parseInt(minutesMatch[1]) : 0

    if (hours === 0 && minutes === 0) {
      return "Duration not specified"
    }

    if (hours < 24) {
      if (minutes === 0) {
        return hours === 1 ? "1 hour" : `${hours} hours`
      }
      return `${hours}h ${minutes}min`
    } else {
      const days = Math.floor(hours / 24)
      const remainingHours = hours % 24

      let result = days === 1 ? "1 day" : `${days} days`
      if (remainingHours > 0) result += ` ${remainingHours}h`
      if (minutes > 0) result += ` ${minutes}min`
      return result
    }
  } catch (error) {
    return "Duration not specified"
  }
}

const TrekCard = ({
  trekId,
  images = [],
  title,
  type,
  duration,
  pickup = "Pickup available",
  price = 176,
  currency = "MAD",
  isFavorite = false,
  onWishlistUpdate,
}) => {
  const formattedDuration = formatDuration(duration)
  const [isLiked, setIsLiked] = useState(isFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const { updateWishlistCount } = useWishlist()

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user?.id || !trekId) return;

      try {
        const response = await wishlistApi.getTouristWishlistTrekIds(user.id);
        if (response.success) {
          const isInWishlist = response.data.includes(Number(trekId));
          setIsLiked(isInWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    if (isAuthenticated && user?.role.toLowerCase() === "tourist") {
      checkWishlistStatus();
    }
  }, [user?.id, trekId, isAuthenticated]);

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
      const response = await wishlistApi[isLiked ? 'removeFromWishlist' : 'addToWishlist'](user.id, trekId)
      
      if (response.success) {
        setIsLiked(!isLiked)
        updateWishlistCount(response.count)
        if (onWishlistUpdate) {
          onWishlistUpdate(!isLiked)
        }
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      toast.error(error.message || "Failed to update wishlist")
    } finally {
      setIsLoading(false)
    }
  }

  const primaryImage = images?.find((img) => img.isPrimary) || images?.[0]
  const imageUrl = primaryImage ? `http://localhost:8080/api/uploads/images/${primaryImage.path}` : ""

  return (
    <Link to={`/treks/${trekId}`} className="block group">
      <div
        className="flex flex-col rounded-xl overflow-hidden transition-all duration-300 
        bg-white border border-gray-100 group-hover:border-emerald-500 group-hover:shadow-xl transform group-hover:-translate-y-2"
      >
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

          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleWishlistClick()
            }}
            disabled={isLoading}
            className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300
              ${
                isLiked
                  ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white"
                  : "bg-white/90 text-gray-700 hover:bg-emerald-500 hover:text-white"
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

        <div className="flex flex-col p-5 gap-3">
          <div className="space-y-2">
            <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">
              {title}
            </h3>

            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span className="text-sm">{formattedDuration}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-sm">{pickup}</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 mt-2 pt-3 border-t border-gray-100">
            <span className="text-xl font-bold text-emerald-600">{price.toLocaleString()}</span>
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

