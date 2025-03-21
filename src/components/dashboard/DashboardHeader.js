"use client"

import { Bell, Search, LogOut, User } from "lucide-react"
import { useState } from "react"

export default function DashboardHeader({ user, notifications = 0, logout }) {
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-[#232630] border-b border-gray-800 shadow-md sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-[#191b20] text-white focus:ring-2 focus:ring-[#fe5532] focus:border-transparent transition-all placeholder-gray-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#fe5532] rounded-lg transition-colors">
              <Bell className="h-6 w-6" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-[#fe5532] text-white rounded-full border-2 border-[#232630]">
                  {notifications}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 focus:outline-none"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="h-10 w-10 rounded-full bg-[#fe5532]/20 flex items-center justify-center text-[#fe5532] border border-[#fe5532]/30">
                {user?.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt="User avatar"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{user?.lastName || "Admin User"}</p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#232630] border border-gray-700 rounded-lg shadow-lg py-1 z-20">
                <a
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#fe5532]/10 hover:text-white"
                >
                  Profile
                </a>
                <a
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#fe5532]/10 hover:text-white"
                >
                  Settings
                </a>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-sm text-[#fe5532] hover:bg-[#fe5532]/10"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Logout Button */}
          {logout && (
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#fe5532] rounded-md hover:bg-[#fe5532]/90 transition-colors shadow-sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

