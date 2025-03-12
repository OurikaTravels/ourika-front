"use client"

import { useState, useRef } from "react"
import {
  Sparkles,
  Building2,
  Utensils,
  Mountain,
  ChevronRight,
  ChevronLeft,
  Palmtree,
  Camera,
  Ticket,
  Users,
} from "lucide-react"
import { useTheme } from "../../context/ThemeContext"

const categories = [
  { id: 1, name: "For you", icon: Sparkles },
  { id: 2, name: "Culture", icon: Building2 },
  { id: 3, name: "Food", icon: Utensils },
  { id: 4, name: "Nature", icon: Mountain },
  { id: 5, name: "Beach", icon: Palmtree },
  { id: 6, name: "Photography", icon: Camera },
  { id: 7, name: "Events", icon: Ticket },
  { id: 8, name: "Local Guides", icon: Users },
]

export default function Categories() {
  const [activeCategory, setActiveCategory] = useState(1)
  const scrollContainerRef = useRef(null)
  const { theme } = useTheme()

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div
      className={`w-full mt-8 ${
        theme === "dark" ? "bg-gray-900 border-y border-gray-800" : "bg-white border-y border-gray-100"
      }`}
    >
      <div className="container mx-auto relative">
        
        <div
          ref={scrollContainerRef}
          className="flex items-center justify-center gap-6 py-3 overflow-x-auto scrollbar-hide group relative scroll-smooth"
        >
          {categories.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 
                whitespace-nowrap min-w-fit
                ${
                  activeCategory === id
                    ? theme === "dark"
                      ? "bg-[#ff4040] text-white"
                      : "bg-[#ff5d5d] text-white"
                    : theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                }`}
            >
              <Icon className={`h-5 w-5 ${activeCategory === id ? "" : "opacity-75"}`} />
              <span className="text-sm font-medium">{name}</span>
            </button>
          ))}
        </div>

        
        <div className="absolute left-0 top-0 bottom-0 flex items-center">
          <button
            onClick={() => scroll("left")}
            className={`p-2 rounded-full transition-opacity duration-200
              ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }
              opacity-0 group-hover:opacity-100 focus:opacity-100`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div className="absolute right-0 top-0 bottom-0 flex items-center">
          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded-full transition-opacity duration-200
              ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }
              opacity-0 group-hover:opacity-100 focus:opacity-100`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

