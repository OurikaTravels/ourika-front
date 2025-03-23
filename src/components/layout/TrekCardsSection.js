"use client"

import { useState, useEffect } from "react"
import categoryApi from "../../services/categoryApi"
import trekApi from "../../services/trekApi"
import TrekCard from "../common/TrekCard"
import { toast } from "react-hot-toast"
import { ChevronRight, ChevronLeft, Mountain, Map, Loader2 } from "lucide-react"

export default function TrekCardsSection() {
  const [categories, setCategories] = useState([])
  const [treks, setTreks] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [cardsPerPage] = useState(8)

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

  useEffect(() => {
    const fetchTreks = async () => {
      setIsLoading(true)
      setCurrentPage(1) 
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

  const indexOfLastCard = currentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentCards = treks.slice(indexOfFirstCard, indexOfLastCard)
  const totalPages = Math.ceil(treks.length / cardsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)

      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 3) {
        endPage = 4
      }

      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }

      if (startPage > 2) {
        pageNumbers.push("...")
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      if (endPage < totalPages - 1) {
        pageNumbers.push("...")
      }

      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  return (
    <section className="pb-20 pt-0 bg-gradient-to-b from-white to-emerald-50/30">
      <div className="bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden py-16 mb-12">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/5"></div>
          <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-amber-500/5"></div>
          <div className="absolute bottom-0 left-1/4 w-32 h-32 rounded-full bg-teal-500/5"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 opacity-5">
            <div className="absolute bottom-0 left-[10%] w-32 h-24 bg-emerald-900 rounded-t-[100%]"></div>
            <div className="absolute bottom-0 left-[25%] w-48 h-32 bg-emerald-900 rounded-t-[100%]"></div>
            <div className="absolute bottom-0 left-[60%] w-40 h-28 bg-emerald-900 rounded-t-[100%]"></div>
            <div className="absolute bottom-0 left-[80%] w-24 h-20 bg-emerald-900 rounded-t-[100%]"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-4 bg-emerald-50 p-3 rounded-full">
              <Mountain className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Our <span className="text-emerald-600">Treks</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
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
                      ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20 transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100 hover:border-emerald-200"
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
                        ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/20 transform scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100 hover:border-emerald-200"
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading amazing treks...</p>
          </div>
        ) : treks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-emerald-100/20">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4">
                <Map className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No treks found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any treks for this category. Please try another category or check back later.
              </p>
              <button
                onClick={() => setActiveCategory(null)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                View all treks <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-semibold text-gray-800">
                {activeCategory
                  ? `${categories.find((c) => c.id === activeCategory)?.name || "Category"} Treks`
                  : "Continue planning"}
              </h3>
              <div className="hidden md:block">
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm text-gray-500">
                  <span className="text-emerald-600 font-medium">{treks.length}</span> adventures waiting for you
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentCards.map((trek) => (
                <div key={trek.id} className="transform transition-all duration-300 hover:-translate-y-2">
                  <TrekCard
                    trekId={trek.id}
                    images={trek.images || []}
                    title={trek.title}
                    type={trek.type}
                    duration={trek.duration}
                    pickup={trek.pickup}
                    price={trek.price || 0}
                    currency={trek.currency || "MAD"}
                  />
                </div>
              ))}
            </div>

            {treks.length > cardsPerPage && (
              <div className="mt-12 flex flex-col items-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200 shadow-sm"
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {getPageNumbers().map((number, index) => (
                      <button
                        key={index}
                        onClick={() => number !== "..." && paginate(number)}
                        disabled={number === "..."}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                          number === "..."
                            ? "text-gray-500"
                            : number === currentPage
                              ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-600/20"
                              : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200 shadow-sm"
                        }`}
                        aria-label={number === "..." ? `More pages` : `Page ${number}`}
                        aria-current={number === currentPage ? "page" : undefined}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 border border-gray-200 shadow-sm"
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

