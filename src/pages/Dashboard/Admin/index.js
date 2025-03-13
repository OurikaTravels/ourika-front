"use client"

import { useState } from "react"
import { useAuth } from "../../../context/AuthContext"
import { Users, Map, UserCog, Calendar } from "lucide-react"
import DashboardHeader from "../../../components/dashboard/DashboardHeader"
import DashboardSidebar from "../../../components/dashboard/DashboardSidebar"
import StatCard from "../../../components/dashboard/StatCard"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [notifications] = useState(3) 

  const stats = {
    totalUsers: 1234,
    activeGuides: 45,
    totalTreks: 78,
    pendingReservations: 12,
    totalRevenue: "123,456",
    averageRating: 4.8,
    totalPosts: 234,
    monthlyBookings: 567,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <DashboardHeader user={user} notifications={notifications} logout={logout} />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={stats.totalUsers} icon={<Users className="w-6 h-6" />} trend={12} />
            <StatCard
              title="Active Guides"
              value={stats.activeGuides}
              icon={<UserCog className="w-6 h-6" />}
              trend={5}
            />
            <StatCard title="Total Treks" value={stats.totalTreks} icon={<Map className="w-6 h-6" />} trend={8} />
            <StatCard
              title="Pending Reservations"
              value={stats.pendingReservations}
              icon={<Calendar className="w-6 h-6" />}
              trend={-3}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Activity chart placeholder
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h2>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Revenue chart placeholder
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
