"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Link } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext"
import WishlistHeader from "./WishlistHeader"
import WishlistControls from "./WishlistControls"
import WishlistCard from "./WishlistCard"
import { sampleWishlist } from "./wishlist-data" // Move sample data to separate file

const WishlistPage = () => {
  const { theme } = useTheme()
  const [wishlist, setWishlist] = useState(sampleWishlist)
  const [filteredWishlist, setFilteredWishlist] = useState(sampleWishlist)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    priceRange: [0, 1000],
    duration: "all",
  })
  const [sortOption, setSortOption] = useState("dateAdded")

  // Filter and sort wishlist items
  useEffect(() => {
    let filtered = [...wishlist]

    // Apply filters
    if (filters.type !== "all") {
      filtered = filtered.filter((item) => item.type === filters.type)
    }

    if (filters.duration !== "all") {
      filtered = filtered.filter((item) => {
        if (filters.duration === "short" && item.duration.includes("hours") && Number.parseInt(item.duration) <= 4)
          return true
        if (
          filters.duration === "medium" &&
          item.duration.includes("hours") &&
          Number.parseInt(item.duration) > 4 &&
          Number.parseInt(item.duration) <= 8
        )
          return true
        if (
          filters.duration === "long" &&
          (item.duration.includes("days") || (item.duration.includes("hours") && Number.parseInt(item.duration) > 8))
        )
          return true
        return false
      })
    }

    filtered = filtered.filter(
      (item) => item.discountedPrice >= filters.priceRange[0] && item.discountedPrice <= filters.priceRange[1],
    )

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "priceAsc":
          return a.discountedPrice - b.discountedPrice
        case "priceDesc":
          return b.discountedPrice - a.discountedPrice
        case "rating":
          return b.rating - a.rating
        case "dateAdded":
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded)
      }
    })

    setFilteredWishlist(filtered)
  }, [wishlist, filters, sortOption])

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id))
  }

  const clearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      setWishlist([])
    }
  }

  return (
    <div className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
      <WishlistHeader theme={theme} />

      <div className="container mx-auto px-4 py-8">
        <WishlistControls
          theme={theme}
          filteredCount={filteredWishlist.length}
          sortOption={sortOption}
          setSortOption={setSortOption}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          onClearAll={clearWishlist}
          hasItems={wishlist.length > 0}
        />

        {/* Filter panel */}
        {isFilterOpen && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Filters</h3>
              <button
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => {
                  setFilters({
                    type: "all",
                    priceRange: [0, 1000],
                    duration: "all",
                  })
                }}
              >
                Reset all
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Type filter */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Experience Type
                </label>
                <select
                  className={`w-full p-2 rounded-md text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } border`}
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                  <option value="all">All types</option>
                  <option value="DAY TRIP">Day Trip</option>
                  <option value="FULL DAY">Full Day</option>
                  <option value="PRIVATE">Private</option>
                  <option value="GUIDED TOUR">Guided Tour</option>
                  <option value="EVENING">Evening</option>
                </select>
              </div>

              {/* Duration filter */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Duration
                </label>
                <select
                  className={`w-full p-2 rounded-md text-sm ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } border`}
                  value={filters.duration}
                  onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                >
                  <option value="all">Any duration</option>
                  <option value="short">Short (up to 4 hours)</option>
                  <option value="medium">Medium (4-8 hours)</option>
                  <option value="long">Long (8+ hours or multi-day)</option>
                </select>
              </div>

              {/* Price range filter */}
              <div>
                <label
                  className={`block mb-2 text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
                >
                  Price Range: {filters.priceRange[0]} - {filters.priceRange[1]} {wishlist[0]?.currency || "MAD"}
                </label>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceRange: [Number.parseInt(e.target.value), filters.priceRange[1]],
                      })
                    }
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        priceRange: [filters.priceRange[0], Number.parseInt(e.target.value)],
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist items */}
        {filteredWishlist.length > 0 ? (
          <div className="space-y-6">
            {filteredWishlist.map((item) => (
              <WishlistCard key={item.id} item={item} onRemove={removeFromWishlist} theme={theme} />
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-16 px-4 rounded-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white border border-gray-200"
            }`}
          >
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full mb-4 bg-gray-100 dark:bg-gray-700">
              <Heart className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className={`text-lg font-medium mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Your wishlist is empty
            </h3>
            <p className={`max-w-md mx-auto mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              Start exploring and save your favorite experiences to plan your next adventure
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 rounded-full bg-[#ff5d5d] text-white hover:bg-[#ff4040] transition-colors"
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

