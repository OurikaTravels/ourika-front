"use client"

import { useState, useEffect } from "react"
import categoryApi from "../../services/categoryApi"
import trekApi from "../../services/trekApi"
import TrekCard from "../common/TrekCard"
import { toast } from "react-hot-toast"
import { ChevronRight, Compass } from "lucide-react"

export default function TrekCardsSection() {
  const [categories, setCategories] = useState([])
  const [treks, setTreks] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories()
        if (response.success) {
          setCategories(response.data)
        } else {
          toast.error(response.message || "Failed to fetch categories")
        }
      } catch (error) {
        toast.error("Failed to load categories")
      }
    }

    fetchCategories()
  }, [])

  // Fetch treks based on active category
  useEffect(() => {
    const fetchTreks = async () => {
      setIsLoading(true)
      try {
        let response
        if (activeCategory) {
          response = await trekApi.getTreksByCategory(activeCategory)
        } else {
          response = await trekApi.getAllTreks()
        }

        if (response.success) {
          const treksData = Array.isArray(response.data) ? response.data : response.data?.data || []

          setTreks(treksData)
        } else {
          toast.error(response.message || "Failed to fetch treks")
        }
      } catch (error) {
        console.error("Error fetching treks:", error)
        toast.error("Failed to load treks")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTreks()
  }, [activeCategory])

  return (
    <section className="pb-16 pt-0 bg-white">
      {/* Categories Section with distinct background */}
      <div className="bg-gradient-to-b from-gray-50 to-white relative overflow-hidden py-16 mb-12">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#ff5c5c]/5"></div>
          <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-[#ff5c5c]/5"></div>
          <div className="absolute bottom-0 left-1/4 w-32 h-32 rounded-full bg-[#ff5c5c]/5"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Discover Our Treks</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore Morocco's breathtaking landscapes and immerse yourself in authentic experiences
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="flex gap-3 justify-center flex-wrap md:flex-nowrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap text-sm font-medium
                  ${
                    !activeCategory
                      ? "bg-gradient-to-r from-[#ff5c5c] to-[#ff7b7b] text-white shadow-lg shadow-[#ff5c5c]/20 transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100"
                  }`}
              >
                All Treks
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap text-sm font-medium
                    ${
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-[#ff5c5c] to-[#ff7b7b] text-white shadow-lg shadow-[#ff5c5c]/20 transform scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Decorative line */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-[#ff5c5c] to-[#ff7b7b]"></div>
          </div>
        </div>
      </div>

      {/* Treks Grid Section */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-[400px] shadow-md" />
            ))}
          </div>
        ) : treks.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100 shadow-inner">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No treks found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any treks for this category. Please try another category or check back later.
              </p>
              <button
                onClick={() => setActiveCategory(null)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#ff5c5c] to-[#ff7b7b] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                View all treks <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {treks.map((trek) => (
              <TrekCard
                key={trek.id}
                trekId={trek.id}
                images={trek.images || []}
                title={trek.title}
                type={trek.type}
                duration={trek.duration}
                pickup={trek.pickup}
                price={trek.price || 0}
                currency={trek.currency || "MAD"}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

