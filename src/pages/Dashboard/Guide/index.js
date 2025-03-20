"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import { FileText, Calendar, Star, Clock, Menu } from "lucide-react"
import GuideSidebar from "../../../components/dashboard/guide/GuideSidebar"
import StatCard from "../../../components/dashboard/StatCard"
import GuideReservations from "../../../components/dashboard/guide/GuideReservations"
import reservationApi from "../../../services/reservationApi"

export default function GuideDashboard() {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [notifications] = useState(5)
  const [upcomingReservations, setUpcomingReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setIsSidebarOpen(!mobile) // Open sidebar by default on desktop
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const stats = {
    totalPosts: 24,
    totalReservations: 156,
    averageRating: 4.8,
    completedTours: 142,
    upcomingTours: 8,
    monthlyViews: 1234,
    totalReviews: 89,
    responseRate: 98,
  }

  useEffect(() => {
    const fetchUpcomingReservations = async () => {
      try {
        setLoading(true)
        const guideId = localStorage.getItem("guideId")

        if (!guideId) {
          throw new Error("Guide ID not found")
        }

        const parsedGuideId = Number.parseInt(guideId, 10)

        if (isNaN(parsedGuideId)) {
          throw new Error("Invalid guide ID format")
        }

        const result = await reservationApi.getUpcomingReservations(parsedGuideId)

        if (result.success) {
          // Ensure data is an array
          const reservationsData = result.data || []
          const dataArray = Array.isArray(reservationsData) ? reservationsData : [reservationsData]
          setUpcomingReservations(dataArray)
        } else {
          setError(result.message || "Failed to fetch upcoming reservations")
        }
      } catch (err) {
        console.error("Error in fetchUpcomingReservations:", err)
        setError(err.message || "An error occurred while fetching upcoming reservations")
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingReservations()
  }, [])

  return (
    <div className="min-h-screen bg-[#191b20] text-white flex">
      <GuideSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Mobile overlay when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className={`flex-1 transition-all duration-300 ${isMobile ? "ml-0" : isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <header className="bg-[#232630] border-b border-gray-700 shadow-md sticky top-0 z-10">
          <div className="flex items-center justify-between h-16 px-4">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-[#fe5532] hover:bg-[#fe5532]/10 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-white">
              {isMobile ? "Guide Dashboard" : `Welcome, ${user?.lastName || "Guide"}`}
            </h1>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-300 hover:text-white">
                <span className="absolute top-0 right-0 h-4 w-4 bg-[#fe5532] rounded-full text-xs flex items-center justify-center">
                  {notifications}
                </span>
                <span className="sr-only">Notifications</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <button
                onClick={logout}
                className="hidden md:block px-3 py-1.5 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-gray-400">Here's your activity overview for today.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6">
            <StatCard title="Total Posts" value={stats.totalPosts} icon={<FileText className="w-5 h-5" />} trend={8} />
            <StatCard title="Rating" value={stats.averageRating} icon={<Star className="w-5 h-5" />} trend={2} />
            <StatCard title="Upcoming" value={stats.upcomingTours} icon={<Calendar className="w-5 h-5" />} />
            <StatCard
              title="Response"
              value={`${stats.responseRate}%`}
              icon={<Clock className="w-5 h-5" />}
              trend={5}
            />
          </div>

          <div className="mb-6">
            <div className="bg-[#232630] rounded-lg shadow-sm">
              <div className="p-4 md:p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Upcoming Reservations</h2>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-400">Loading...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-[#fe5532]">{error}</p>
                  </div>
                ) : upcomingReservations.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-400">No upcoming reservations found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <GuideReservations reservations={upcomingReservations} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-[#232630] rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Monthly Performance</h2>
              <div className="h-64 flex items-center justify-center text-gray-400">Performance chart placeholder</div>
            </div>

            <div className="bg-[#232630] rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Reviews</h2>
              <div className="h-64 flex items-center justify-center text-gray-400">Reviews list placeholder</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

