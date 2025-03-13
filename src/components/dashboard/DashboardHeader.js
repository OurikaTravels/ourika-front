"use client"

import { Bell, Search, LogOut } from "lucide-react"

export default function DashboardHeader({ user, notifications = 0, logout }) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center flex-1">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ff5c5c] rounded-lg">
            <Bell className="h-6 w-6" />
            {notifications > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-[#ff5c5c] text-white rounded-full">
                {notifications}
              </span>
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center">
            <img
              src={user?.avatar || "/placeholder.svg?height=32&width=32"}
              alt="User avatar"
              className="h-8 w-8 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-white">{user?.lastName || "Admin User"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
            </div>
          </div>

          {/* Logout Button */}
          {logout && (
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-[#ff5c5c] rounded-md hover:bg-[#ff4040] transition-colors"
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

