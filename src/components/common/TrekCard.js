"use client"

import { useState } from "react"
import { Heart, Star } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

const TrekCard = ({
  imageUrl = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jqVG1DVX3DddWY8orqu90x9IBBGdMs.png",
  type = "DAY TRIP",
  title = "From Marrakech: Ouzoud Waterfalls Guided Tour & Boat Ride",
  duration = "10 hours",
  pickup = "Pickup available",
  rating = 4.6,
  reviews = 8951,
  price = 176,
  currency = "MAD",
  isFavorite = false,
}) => {
  const [isLiked, setIsLiked] = useState(isFavorite)
  const { theme } = useTheme()
  
  
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
          src={imageUrl || "/placeholder.svg"} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
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
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300
            ${theme === "dark"
              ? "bg-gray-900/20 hover:bg-gray-900/40"
              : "bg-gray-50/20 hover:bg-gray-50/40"
            } backdrop-blur-sm`}
          aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
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

