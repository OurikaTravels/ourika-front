"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X, ChevronRight, ChevronLeft } from "lucide-react"
import TrendingTopics from "./TrendingTopics"
import TopGuides from "./TopGuides"

export default function CommunitySidebar({ guides, topics, externalIsSidebarOpen, externalToggleSidebar }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilters, setSelectedFilters] = useState([])
  const [internalIsSidebarOpen, setInternalIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Use external state if provided, otherwise use internal state
  const isSidebarOpen = externalIsSidebarOpen !== undefined ? externalIsSidebarOpen : internalIsSidebarOpen
  const toggleSidebar = externalToggleSidebar || (() => setInternalIsSidebarOpen(!internalIsSidebarOpen))

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    // Initial check
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobile && isSidebarOpen) {
        // Check if the click is outside the sidebar
        const sidebar = document.getElementById("community-sidebar")
        const toggleButton = document.getElementById("sidebar-toggle")

        if (sidebar && !sidebar.contains(e.target) && toggleButton && !toggleButton.contains(e.target)) {
          toggleSidebar()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, isSidebarOpen, toggleSidebar])

  const filters = [
    { id: "latest", label: "Latest" },
    { id: "popular", label: "Most Popular" },
    { id: "hiking", label: "Hiking" },
    { id: "desert", label: "Desert Tours" },
    { id: "city", label: "City Tours" },
    { id: "cultural", label: "Cultural" },
    { id: "food", label: "Food Tours" },
  ]

  const toggleFilter = (filterId) => {
    if (selectedFilters.includes(filterId)) {
      setSelectedFilters(selectedFilters.filter((id) => id !== filterId))
    } else {
      setSelectedFilters([...selectedFilters, filterId])
    }
  }

  const clearFilters = () => {
    setSelectedFilters([])
  }

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <button
        id="sidebar-toggle"
        onClick={toggleSidebar}
        className={`lg:hidden fixed z-30 flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-white dark:bg-gray-800 text-[#ff5c5c] border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isSidebarOpen ? "right-[270px]" : "right-4"
        }`}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300"
          onClick={() => toggleSidebar()}
        />
      )}

      {/* Sidebar Container */}
      <div
        id="community-sidebar"
        className={`lg:block fixed lg:relative z-30 lg:z-10 top-0 lg:top-auto right-0 lg:right-auto h-full lg:h-auto w-[270px] lg:w-auto bg-gray-50 dark:bg-gray-900 lg:bg-transparent lg:dark:bg-transparent transition-transform duration-300 ease-in-out transform ${
          isMobile && !isSidebarOpen ? "translate-x-full" : "translate-x-0"
        } lg:translate-x-0 pt-20 lg:pt-0 px-4 lg:px-0`}
      >
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pb-6">
          {/* Search - Only on mobile */}
          {isMobile && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
              <div className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search community..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-[#ff5c5c] focus:border-[#ff5c5c]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              </div>

              {selectedFilters.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#ff5c5c] hover:text-[#ff4040] transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedFilters.includes(filter.id)
                        ? "bg-[#ff5c5c] text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {filter.label}
                    {selectedFilters.includes(filter.id) && <X size={14} className="ml-1 inline-block" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <TrendingTopics topics={topics} />

          {/* Top Guides */}
          <TopGuides guides={guides} />
        </div>
      </div>
    </>
  )
}

