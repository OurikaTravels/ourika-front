"use client"

import { useState } from "react"
import { useAuth } from "../../../context/AuthContext"
import { Users, Map, UserCog, Calendar, DollarSign, Star, BarChart3, Activity, TrendingUp } from "lucide-react"
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
    totalRevenue: "$123,456",
    averageRating: 4.8,
    totalPosts: 234,
    monthlyBookings: 567,
  }

  return (
    <div className="min-h-screen bg-[#191b20] text-white flex">
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
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <p className="mt-1 text-gray-400">Welcome back! Here's what's happening with your platform today.</p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
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

          <div className="grid grid-cols-2 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={stats.totalRevenue}
              icon={<DollarSign className="w-6 h-6" />}
              trend={15}
            />
            <StatCard
              title="Average Rating"
              value={stats.averageRating}
              icon={<Star className="w-6 h-6" />}
              trend={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-[#fe5532]/10 text-[#fe5532] rounded-md hover:bg-[#fe5532]/20 transition-colors">
                    Weekly
                  </button>
                  <button className="px-3 py-1 text-xs bg-[#56acfe]/10 text-[#56acfe] rounded-md hover:bg-[#56acfe]/20 transition-colors">
                    Monthly
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">
                    Yearly
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full h-full bg-[#191b20]/50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Booking Analytics</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-[#fe5532]/10 text-[#fe5532] rounded-md hover:bg-[#fe5532]/20 transition-colors">
                    Last 7 days
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors">
                    Last 30 days
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                <div className="w-full h-full bg-[#191b20]/50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-gray-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center p-3 bg-[#191b20] rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-[#56acfe]/20 flex items-center justify-center text-[#56acfe] mr-4">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        New reservation made for Trek #{Math.floor(Math.random() * 1000)}
                      </p>
                      <p className="text-xs text-gray-400">{Math.floor(Math.random() * 60)} minutes ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4">Top Performing Treks</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-[#191b20] rounded-lg">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-[#fe5532]/20 flex items-center justify-center text-[#fe5532] mr-3">
                        <Map className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm text-white">Mountain Trek #{item}</p>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-xs text-gray-400">{(4 + Math.random()).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#56acfe]">
                      {Math.floor(Math.random() * 100)} bookings
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

