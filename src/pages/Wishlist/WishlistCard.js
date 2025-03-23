"use client"

import { Trash2, Clock, MapPin, Star } from 'lucide-react'
import { Link } from "react-router-dom"

const WishlistCard = ({ item, onRemove, theme }) => {
  console.log('WishlistCard Item:', item);


  if (!item || !item.trek) {
    console.error('Invalid item data:', item);
    return null;
  }

  const trek = item.trek;
  const imageUrl = trek.images?.length > 0
    ? `http://localhost:8080/api/treks/${trek.id}/images/${trek.images[0].path}`
    : "/placeholder.svg";

  return (
    <div
      className={`flex flex-col md:flex-row gap-6 p-6 rounded-lg shadow-sm ${
        theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
      } hover:border-[#049769]/30 transition-all duration-300`}
    >

      <div className="w-full md:w-64 h-48 flex-shrink-0">
        <img
          src={imageUrl}
          alt={trek.title}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.target.src = '/placeholder.svg';
            e.target.onerror = null;
          }}
        />
      </div>


      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <span className={`text-sm font-medium ${
              theme === "dark" ? "text-[#049769]" : "text-[#049769]"
            }`}>
              {trek.categoryId === 1 ? "DAY TRIP" : "MULTI-DAY"}
            </span>
            <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} mt-1`}>
              {trek.title}
            </h3>
          </div>
          <button
            onClick={() => onRemove(trek.id)}
            className={`p-2 rounded-full ${
              theme === "dark" ? "hover:bg-[#049769]/20" : "hover:bg-[#049769]/10"
            }`}
            aria-label="Remove from wishlist"
          >
            <Trash2 className="w-5 h-5 text-[#049769]" />
          </button>
        </div>


        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{trek.duration || 'Duration not specified'}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {trek.services?.some(service => 
                  service.name?.toLowerCase().includes('pickup')
                ) ? 'Pickup available' : 'No pickup'}
              </span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm text-gray-500">
                {trek.rating || 4.5} ({trek.reviews || 0} reviews)
              </span>
            </div>
          </div>
        </div>


        <p className={`text-sm mt-3 line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          {trek.description || 'No description available'}
        </p>

 
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {trek.price} MAD
            </span>
            <span className="text-sm text-[#049769]/70 line-through">
              {Math.round(trek.price * 1.2)} MAD
            </span>
          </div>
          <Link
            to={`/treks/${trek.id}`}
            className="px-4 py-2 bg-[#049769] text-white rounded-lg hover:bg-[#049769]/90 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WishlistCard
