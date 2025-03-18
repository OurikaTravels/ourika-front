"use client"

import { useState, useEffect } from "react"
import { Heart } from 'lucide-react'
import { Link } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import wishlistApi from "../../services/wishlistApi"
import { toast } from "react-hot-toast"
import WishlistHeader from "./WishlistHeader"
import WishlistCard from "./WishlistCard"

const WishlistPage = () => {
  const { theme } = useTheme()
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortOption, setSortOption] = useState("dateAdded")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    priceRange: [0, 5000],
    duration: "all",
    rating: 0
  })

  const formatDuration = (isoDuration) => {
    try {
      
      const hourMatch = isoDuration.match(/PT(\d+)H/)
      const minuteMatch = isoDuration.match(/(\d+)M/)
      const dayMatch = isoDuration.match(/P(\d+)D/)
      
      let result = ""
      
      if (dayMatch) {
        result += `${dayMatch[1]} day${dayMatch[1] > 1 ? 's' : ''} `
      }
      
      if (hourMatch) {
        result += `${hourMatch[1]} hour${hourMatch[1] > 1 ? 's' : ''} `
      }
      
      if (minuteMatch) {
        result += `${minuteMatch[1]} min`
      }
      
      return result.trim() || "Duration not specified"
    } catch (error) {
      console.error("Error formatting duration:", error)
      return isoDuration
    }
  }

  const fetchWishlist = async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const response = await wishlistApi.getTouristWishlist(user.id)
      console.log("Wishlist API response:", response) // Debug log
      
      if (response.success) {
        // Check if response.data exists and is an array
        if (Array.isArray(response.data)) {
          const wishlistData = response.data
          console.log("Wishlist data:", wishlistData) // Debug log
          
          // Transform the data according to the actual API response structure
          const transformedData = wishlistData.map(item => {
            const trek = item.trek || {}
            
            // Find primary image or use the first one
            const primaryImage = trek.images?.find(img => img.isPrimary)?.path || 
                                (trek.images?.length > 0 ? trek.images[0].path : null)
            
            return {
              id: trek.id,
              title: trek.title || "No Title",
              type: trek.categoryId === 1 ? "DAY TRIP" : "MULTI-DAY",
              duration: formatDuration(trek.duration || "PT0H"),
              description: trek.description || "",
              pickup: trek.services?.some(service => 
                service.name?.toLowerCase().includes("pickup")) ? "Pickup available" : "No pickup",
              rating: 4.5, // Default since it's not in the response
              reviews: 0,  // Default since it's not in the response
              imageUrl: primaryImage 
                ? `http://localhost:8080/api/treks/${trek.id}/images/${primaryImage}`
                : '/placeholder.svg',
              discountedPrice: trek.price || 0,
              originalPrice: Math.round((trek.price || 0) * 1.2),
              currency: "MAD",
              addedDate: new Date(item.addedDate),
              highlights: trek.highlights || [],
              services: trek.services || [],
              startLocation: trek.startLocation,
              endLocation: trek.endLocation
            }
          })
          
          console.log("Transformed data:", transformedData) // Debug log
          setWishlist(transformedData)
        } else {
          // If response.data is not an array, log it and set empty wishlist
          console.error("Unexpected response data format:", response.data)
          setWishlist([])
        }
      } else {
        setWishlist([])
        toast.error(response.message || "Failed to fetch wishlist")
      }
    } catch (error) {
      toast.error("Failed to fetch wishlist")
      console.error("Wishlist fetch error:", error)
      setWishlist([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchWishlist()
    }
  }, [user?.id])

  const removeFromWishlist = async (trekId) => {
    if (!user?.id) return

    try {
      const response = await wishlistApi.removeFromWishlist(user.id, trekId)
      if (response.success) {
        setWishlist(wishlist.filter(item => item.id !== trekId))
        toast.success("Removed from wishlist")
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      toast.error("Failed to remove from wishlist")
    }
  }

  // Filter and sort the wishlist
  const filteredAndSortedWishlist = wishlist
    .filter(item => {
      if (filters.type !== "all" && item.type !== filters.type) return false
      if (item.discountedPrice < filters.priceRange[0] || item.discountedPrice > filters.priceRange[1]) return false
      if (filters.rating > 0 && item.rating < filters.rating) return false
      return true
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "dateAdded":
          return new Date(b.addedDate) - new Date(a.addedDate)
        case "priceAsc":
          return a.discountedPrice - b.discountedPrice
        case "priceDesc":
          return b.discountedPrice - a.discountedPrice
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

  return (
    <div className={`min-h-screen ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
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
          <div className="text-center py-8">
            <p className={`text-lg mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
              Your wishlist is empty
            </p>
            <Link
              to="/treks"
              className="inline-block px-6 py-3 bg-[#ff5d5d] text-white rounded-lg hover:bg-[#ff4040] transition-colors"
            >
              Explore Tours
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage