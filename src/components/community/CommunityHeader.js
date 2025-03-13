"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Home, Bell, MessageCircle, User, Filter } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"

export default function CommunityHeader({ toggleSidebar }) {
  const { user, isAuthenticated } = useAuth()
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMessages, setShowMessages] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Home Link */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-[#ff5d5d] hover:text-[#ff4040] transition-colors">
              <Home className="h-5 w-5 mr-1" />
              <span className="font-bold text-lg hidden sm:inline-block">OURIKA TRAVELS</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search community..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-[#ff5c5c] focus:border-[#ff5c5c]"
              />
            </div>
          </div>

          {/* User Navigation */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Mobile Sidebar Toggle */}
                <button
                  className="lg:hidden p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-[#ff5c5c] hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  onClick={toggleSidebar}
                  aria-label="Toggle filters and guides"
                >
                  <Filter className="h-6 w-6" />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-[#ff5c5c] hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-[#ff5c5c] ring-2 ring-white dark:ring-gray-800"></span>
                  </button>
                </div>

                {/* Messages */}
                <div className="relative">
                  <button
                    className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-[#ff5c5c] hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                    onClick={() => setShowMessages(!showMessages)}
                  >
                    <MessageCircle className="h-6 w-6" />
                  </button>
                </div>

                {/* User Profile */}
                <div className="relative">
                  <Link to="/profile" className="flex items-center space-x-2">
                    <div className="relative">
                      <img
                        src={user?.profileImage || "/placeholder.svg?height=32&width=32"}
                        alt="User profile"
                        className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                      />
                      {user?.role === "guide" && (
                        <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></span>
                      )}
                    </div>
                    <span className="hidden md:inline-block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.lastName || "User"}
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              <Link
                to="/Auth/Login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#ff5c5c] hover:bg-[#ff4040] transition-colors"
              >
                <User className="h-4 w-4 mr-1" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

