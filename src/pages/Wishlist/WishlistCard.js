"use client"

import { Trash2 } from "lucide-react"

const WishlistCard = ({ item, onRemove, theme }) => {
  return (
    <div
      className={`flex flex-col md:flex-row gap-6 p-6 rounded-lg shadow-sm ${
        theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
      }`}
    >
      {/* Image */}
      <div className="w-full md:w-64 h-48 flex-shrink-0">
        <img
          src={item.imageUrl || "/placeholder.svg"}
          alt={item.title}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <span className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              {item.type}
            </span>
            <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} mt-1`}>
              {item.title}
            </h3>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className={`p-2 rounded-full ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            aria-label="Remove from wishlist"
          >
            <Trash2 className="w-5 h-5 text-[#ff5d5d]" />
          </button>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center mt-2">
          <span className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            ⭐ {item.rating} ({item.reviews} reviews)
          </span>
        </div>

        {/* Duration and Pickup */}
        <div className="mt-2">
          <p className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            🕒 {item.duration} • {item.pickup}
          </p>
        </div>

        {/* Price */}
        <div className="mt-4">
          <p className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {item.discountedPrice} {item.currency}{" "}
            <span className="text-sm line-through text-gray-400">
              {item.originalPrice} {item.currency}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-auto pt-4 flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2 text-sm font-medium text-[#ff5c5c] border border-[#ff5c5c] rounded-md hover:bg-[#ff5c5c] hover:bg-opacity-10 transition-colors">
            View More
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#ff5c5c] rounded-md hover:bg-opacity-90 transition-colors">
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default WishlistCard

