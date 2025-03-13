"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Search, Heart, X, Menu, User, Calendar, Users } from "lucide-react"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import ProfileDropdown from "../common/ProfileDropdown"
import ThemeToggle from "../common/ThemeToggle"

const cn = (...classes) => classes.filter(Boolean).join(" ")

const Navbar = () => {
  const { theme } = useTheme()
  const { user, isAuthenticated } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef(null)

  // Check if user is a tourist
  const isTourist = isAuthenticated && user?.role === "tourist"

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle click outside search results
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

  // Check if a route is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        isScrolled ? "shadow-md" : "shadow-sm",
        theme === "dark" ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-[#ff5d5d] hover:opacity-90 transition-opacity">
            OURIKA TRAVELS
          </Link>

          <div className="flex-1 max-w-2xl mx-6" ref={searchRef}>
            <div className="relative">
              <div
                className={cn(
                  "flex items-center rounded-full overflow-hidden border shadow-sm transition-all",
                  "focus-within:ring-2 focus-within:ring-[#ff5d5d]/20",
                  theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
                )}
              >
                <Search className="h-5 w-5 ml-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tours, activities..."
                  className={cn(
                    "w-full p-3 pl-2 outline-none text-sm border-0",
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900",
                  )}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-2 mr-2 hover:text-gray-600 text-gray-400 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button className="bg-[#ff5d5d] text-white px-6 py-3 hover:bg-[#ff4040] transition-colors">
                  Search
                </button>
              </div>

              {showResults && searchQuery && (
                <div
                  className={cn(
                    "absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg border z-50",
                    "animate-in fade-in-50 slide-in-from-top-5 duration-200",
                    theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                  )}
                >
                  {searchResults.length > 0 ? (
                    <div className="p-2">{/* Search results would go here */}</div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">No results found for "{searchQuery}"</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <ThemeToggle />

            <Link
              to="/supplier"
              className={cn(
                "text-sm font-medium transition-colors",
                theme === "dark" ? "hover:text-gray-300" : "hover:text-gray-600",
              )}
            >
              Become a Supplier
            </Link>

            <Link
              to="/community"
              className={cn(
                "text-sm font-medium transition-colors",
                isActive("/community")
                  ? "text-[#ff5d5d]"
                  : theme === "dark"
                    ? "hover:text-gray-300"
                    : "hover:text-gray-600",
              )}
            >
              Community
            </Link>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <NavIcon
                to="/wishlist"
                icon={<Heart className="h-6 w-6" />}
                label="Wishlist"
                badge={0}
                isActive={isActive("/wishlist")}
              />

              {/* Bookings - Only show if user is a tourist */}
              {isTourist && (
                <NavIcon
                  to="/bookings"
                  icon={<Calendar className="h-6 w-6" />}
                  label="Bookings"
                  isActive={isActive("/bookings")}
                />
              )}

              {/* Profile */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "transition-colors",
                    isActive("/profile")
                      ? "text-[#ff5d5d]"
                      : theme === "dark"
                        ? "text-gray-300 hover:text-[#ff5d5d]"
                        : "text-gray-700 hover:text-[#ff5d5d]",
                  )}
                >
                  <ProfileDropdown />
                </div>
                {isAuthenticated && user?.lastName && (
                  <span className="text-xs mt-1 text-gray-600 dark:text-gray-400 truncate max-w-[60px]">
                    {user.lastName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between h-14">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "p-2 -ml-2 focus:outline-none focus:ring-2 focus:ring-[#ff5d5d]/20 rounded-md",
              theme === "dark" ? "text-white" : "text-gray-900",
            )}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="text-lg font-bold text-[#ff5d5d]">
            OURIKA TRAVELS
          </Link>

          <div className="flex items-center space-x-4">
            <ProfileDropdown />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={cn("md:hidden py-4", "animate-in slide-in-from-top-5 duration-200")}>
            <div className="relative mb-4" ref={searchRef}>
              <div
                className={cn(
                  "flex items-center rounded-lg overflow-hidden border shadow-sm",
                  theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white",
                )}
              >
                <Search className="h-5 w-5 ml-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tours, activities..."
                  className={cn(
                    "w-full p-3 pl-2 outline-none text-sm",
                    theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900",
                  )}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-2 mr-2 text-gray-400"
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button className="bg-[#ff5d5d] text-white px-4 py-3 hover:bg-[#ff4040] transition-colors">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              className={cn("space-y-1 pb-3 pt-2 border-t", theme === "dark" ? "border-gray-700" : "border-gray-200")}
            >
              <Link
                to="/supplier"
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Become a Supplier
              </Link>

              <MobileNavLink
                to="/community"
                icon={<Users className="h-5 w-5" />}
                label="Community"
                onClick={() => setIsMobileMenuOpen(false)}
                isActive={isActive("/community")}
              />

              {/* Mobile Navigation Links */}
              <MobileNavLink
                to="/wishlist"
                icon={<Heart className="h-5 w-5" />}
                label="Wishlist"
                badge={0}
                onClick={() => setIsMobileMenuOpen(false)}
                isActive={isActive("/wishlist")}
              />

              {/* Bookings - Only show if user is a tourist */}
              {isTourist && (
                <MobileNavLink
                  to="/bookings"
                  icon={<Calendar className="h-5 w-5" />}
                  label="Bookings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  isActive={isActive("/bookings")}
                />
              )}

              {isAuthenticated && (
                <MobileNavLink
                  to="/profile"
                  icon={<User className="h-5 w-5" />}
                  label="Profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  isActive={isActive("/profile")}
                />
              )}

              <div className={cn("px-4 py-3", theme === "dark" ? "text-gray-300" : "text-gray-700")}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

// Navigation Icon Component
const NavIcon = ({ to, icon, label, badge, isActive }) => {
  const { theme } = useTheme()

  return (
    <Link to={to} className="relative group flex flex-col items-center" aria-label={label}>
      <div
        className={cn(
          "transition-colors",
          isActive
            ? "text-[#ff5d5d]"
            : theme === "dark"
              ? "text-gray-300 group-hover:text-[#ff5d5d]"
              : "text-gray-700 group-hover:text-[#ff5d5d]",
        )}
      >
        {icon}
      </div>
      <span className="text-xs mt-1 text-gray-600 dark:text-gray-400">{label}</span>
      {badge !== undefined && (
        <span className="absolute -top-2 -right-2 bg-[#ff5d5d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  )
}

// Mobile Navigation Link Component
const MobileNavLink = ({ to, icon, label, badge, onClick, isActive }) => {
  const { theme } = useTheme()

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium rounded-md transition-colors",
        isActive
          ? theme === "dark"
            ? "bg-gray-700 text-[#ff5d5d]"
            : "bg-gray-100 text-[#ff5d5d]"
          : theme === "dark"
            ? "hover:bg-gray-800"
            : "hover:bg-gray-100",
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && (
        <span className="ml-auto bg-[#ff5d5d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  )
}

export default Navbar

