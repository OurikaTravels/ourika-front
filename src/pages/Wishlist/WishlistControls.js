"use client"

import { useState, useEffect } from "react"
import { Filter, ArrowDownUp, Trash2 } from "lucide-react"

const WishlistControls = ({
  theme,
  filteredCount,
  sortOption,
  setSortOption,
  isFilterOpen,
  setIsFilterOpen,
  onClearAll,
  hasItems,
}) => {
  const [isHeaderFixed, setIsHeaderFixed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderFixed(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`${
        isHeaderFixed ? "sticky top-16 z-40 py-4 border-b border-gray-800" : "py-4"
      } ${theme === "dark" ? "bg-[#0F172A]" : "bg-white"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-400">
            {filteredCount} {filteredCount === 1 ? "item" : "items"} saved
          </div>

          <div className="flex items-center gap-3">
            {/* Sort dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                onClick={() => document.getElementById("sortDropdown").classList.toggle("hidden")}
              >
                <ArrowDownUp className="w-4 h-4" />
                <span>Sort</span>
              </button>
              <div
                id="sortDropdown"
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50 hidden bg-gray-800 border border-gray-700"
              >
                <div className="py-1">
                  {[
                    { value: "dateAdded", label: "Date added (newest)" },
                    { value: "priceAsc", label: "Price (low to high)" },
                    { value: "priceDesc", label: "Price (high to low)" },
                    { value: "rating", label: "Rating (highest)" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        sortOption === option.value
                          ? "bg-[#ff5d5d] text-white"
                          : theme === "dark"
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSortOption(option.value)
                        document.getElementById("sortDropdown").classList.add("hidden")
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter button */}
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 ${
                isFilterOpen ? "bg-[#ff5d5d] border-[#ff5d5d] hover:bg-[#ff4040]" : ""
              }`}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>

            {/* Clear wishlist button */}
            {hasItems && (
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                onClick={onClearAll}
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WishlistControls

