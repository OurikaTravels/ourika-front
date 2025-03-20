"use client"

import { Trash2, Clock, MapPin, Star } from 'lucide-react'
import { Link } from "react-router-dom"

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
          onError={(e) => {
            e.target.src = '/placeholder.svg';
            e.target.onerror = null;
          }}
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

        {/* Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{item.duration}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{item.pickup}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm text-gray-500">{item.rating} ({item.reviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className={`text-sm mt-3 line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {item.description}
        </p>

        {/* Price and Action */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {item.discountedPrice} {item.currency}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {item.originalPrice} {item.currency}
            </span>
          </div>
          <Link
            to={`/treks/${item.id}`}
            className="px-4 py-2 bg-[#ff5d5d] text-white rounded-lg hover:bg-[#ff4040] transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WishlistCard