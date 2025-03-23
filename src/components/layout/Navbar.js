"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, Heart, X, Menu, User, Calendar, Users, MapPin, Mountain } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import ProfileDropdown from "../common/ProfileDropdown"
import trekApi from "../../services/trekApi"
import wishlistApi from "../../services/wishlistApi"
import reservationApi from "../../services/reservationApi"
import { useWishlist } from "../../context/WishlistContext"
import { useReservation } from "../../context/ReservationContext"

const cn = (...classes) => classes.filter(Boolean).join(" ")

const NavIcon = ({ to, icon, label, badge, isActive }) => {
  return (
    <Link to={to} className="relative flex flex-col items-center group" aria-label={label}>
      <div
        className={cn(
          "transition-all duration-200",
          isActive ? "text-emerald-600" : "text-gray-600 group-hover:text-emerald-600",
        )}
      >
        {icon}
      </div>
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          {badge}
        </span>
      )}
      <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
    </Link>
  )
}

const Navbar = () => {
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef(null)
  const { wishlistCount, updateWishlistCount } = useWishlist() // Get both count and update function
  const { reservationCount, updateReservationCount } = useReservation()


  const isTourist = isAuthenticated && user?.role.toLowerCase() === "tourist";
  const isGuideOrAdmin = isAuthenticated && (user?.role.toLowerCase() === "guide" || user?.role.toLowerCase() === "admin");

  const searchTreks = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await trekApi.searchTreks(query)
      if (response.success) {
        setSearchResults(response.data)
        setShowResults(true)
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTreks(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleResultClick = (trekId) => {
    navigate(`/treks/${trekId}`)
    setShowResults(false)
    setSearchQuery("")
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const isActive = (path) => {
    return location.pathname === path
  }

  useEffect(() => {
    const fetchWishlistCount = async () => {
      if (isAuthenticated && user?.id && isTourist) {
        try {
          const response = await wishlistApi.getWishlistCount(user.id)
          if (response.success) {
            updateWishlistCount(response.count) 
          }
        } catch (error) {
          console.error("Failed to fetch wishlist count:", error)
        }
      }
    }

    fetchWishlistCount()
  }, [isAuthenticated, user?.id, isTourist, updateWishlistCount]) 

  useEffect(() => {
    const fetchReservationCount = async () => {
      if (isAuthenticated && user?.id && isTourist) {
        try {
          const response = await reservationApi.getReservationCount(user.id)
          if (response.success) {
            updateReservationCount(response.count)
          }
        } catch (error) {
          console.error("Failed to fetch reservation count:", error)
        }
      }
    }

    fetchReservationCount()
  }, [isAuthenticated, user?.id, isTourist, updateReservationCount])

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-gray-200 shadow-sm"
          : "bg-gradient-to-r from-emerald-50/80 to-white border-emerald-100/50",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex-shrink-0 flex items-center gap-1">
            <Mountain className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              OURIKA
            </span>
            <span className="text-xl font-bold text-gray-800 ml-1">TRAVELS</span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 focus:outline-none transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <div className="hidden md:block flex-1 max-w-2xl mx-6" ref={searchRef}>
            <div className="relative">
              <div className="flex items-center rounded-full overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-200 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-100">
                <Search className="h-5 w-5 ml-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tours, activities..."
                  className="w-full p-3 pl-2 outline-none text-sm border-0 bg-transparent text-gray-900 placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setShowResults(false)
                    }}
                    className="p-2 mr-2 hover:text-emerald-600 text-gray-500 transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {showResults && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-lg border border-gray-200 bg-white max-h-[400px] overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-600">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {searchResults.map((trek) => (
                        <div
                          key={trek.id}
                          onClick={() => handleResultClick(trek.id)}
                          className="flex items-center gap-4 p-4 cursor-pointer transition-colors duration-200 hover:bg-emerald-50"
                        >
                          <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={trek.primaryImageUrl || "/placeholder.svg?height=56&width=56"}
                              alt={trek.title}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/placeholder.svg?height=56&width=56"
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-gray-900">{trek.title}</p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3 mr-1 text-emerald-600" />
                              <p className="truncate">{trek.location || trek.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="mb-3 text-gray-400">
                        <Search className="h-8 w-8 mx-auto opacity-50" />
                      </div>
                      <p className="text-gray-600 font-medium">No results found for "{searchQuery}"</p>
                      <p className="text-gray-500 text-sm mt-1">Try different keywords or browse our categories</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {(!isAuthenticated || !isTourist) && (
              <Link
                to="/Auth/Login"
                className="text-sm font-medium text-gray-700 transition-all duration-200 hover:text-emerald-600 relative group"
              >
                Become a Supplier
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            <Link
              to="/community"
              className={cn(
                "text-sm font-medium transition-all duration-200 relative group",
                isActive("/community") ? "text-emerald-600" : "text-gray-700 hover:text-emerald-600",
              )}
            >
              Community
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-emerald-600 transition-all duration-300",
                  isActive("/community") ? "w-full" : "w-0 group-hover:w-full",
                )}
              ></span>
            </Link>

            <div className="flex items-center space-x-6 pl-2">
              {isTourist && (
                <>
                  <NavIcon
                    to="/wishlist"
                    icon={<Heart className="h-6 w-6" />}
                    label="Wishlist"
                    badge={wishlistCount}
                    isActive={isActive("/wishlist")}
                  />
                  <NavIcon
                    to="/bookings"
                    icon={<Calendar className="h-6 w-6" />}
                    label="Bookings"
                    badge={reservationCount}
                    isActive={isActive("/bookings")}
                  />
                </>
              )}

              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "transition-colors",
                    isActive("/profile") ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600",
                  )}
                >
                  <ProfileDropdown />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white pb-6 px-4 border-t border-gray-100 shadow-lg">
          <div className="pt-4 pb-3">
            <div className="flex items-center rounded-full overflow-hidden border border-gray-200 bg-white shadow-sm">
              <Search className="h-5 w-5 ml-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for tours, activities..."
                className="w-full p-3 pl-2 outline-none text-sm border-0 bg-transparent text-gray-900 placeholder-gray-500"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setShowResults(false)
                  }}
                  className="p-2 mr-2 hover:text-emerald-600 text-gray-500 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {showResults && searchQuery && (
              <div className="mt-2 rounded-xl shadow-lg border border-gray-200 bg-white max-h-[300px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mx-auto"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {searchResults.map((trek) => (
                      <div
                        key={trek.id}
                        onClick={() => {
                          handleResultClick(trek.id)
                          setIsMobileMenuOpen(false)
                        }}
                        className="flex items-center gap-4 p-4 cursor-pointer transition-colors hover:bg-emerald-50"
                      >
                        <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={trek.primaryImageUrl || "/placeholder.svg?height=56&width=56"}
                            alt={trek.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg?height=56&width=56"
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate text-gray-900">{trek.title}</p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1 text-emerald-600" />
                            <p className="truncate">{trek.location || trek.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="mb-3 text-gray-400">
                      <Search className="h-8 w-8 mx-auto opacity-50" />
                    </div>
                    <p className="text-gray-600 font-medium">No results found for "{searchQuery}"</p>
                    <p className="text-gray-500 text-sm mt-1">Try different keywords or browse our categories</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1 pt-2">
            {(!isAuthenticated || !isTourist) && (
              <Link
                to="/Auth/Login"
                className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="font-medium">Become a Supplier</span>
                </div>
              </Link>
            )}

            <Link
              to="/community"
              className={cn(
                "block px-3 py-3 rounded-lg transition-colors",
                isActive("/community")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600",
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3 text-gray-500" />
                <span className="font-medium">Community</span>
              </div>
            </Link>

            {isTourist && (
              <>
                <Link
                  to="/wishlist"
                  className={cn(
                    "block px-3 py-3 rounded-lg transition-colors",
                    isActive("/wishlist")
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className={cn("h-5 w-5 mr-3", isActive("/wishlist") ? "text-emerald-600" : "text-gray-500")} />
                      <span className="font-medium">Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-amber-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                </Link>

                <Link
                  to="/bookings"
                  className={cn(
                    "block px-3 py-3 rounded-lg transition-colors",
                    isActive("/bookings")
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-600",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar
                        className={cn("h-5 w-5 mr-3", isActive("/bookings") ? "text-emerald-600" : "text-gray-500")}
                      />
                      <span className="font-medium">Bookings</span>
                    </div>
                    {reservationCount > 0 && (
                      <span className="bg-amber-500 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                        {reservationCount}
                      </span>
                    )}
                  </div>
                </Link>
              </>
            )}

            <div className="px-3 py-3">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-gray-500" />
                <span className="font-medium text-gray-700">Profile</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

