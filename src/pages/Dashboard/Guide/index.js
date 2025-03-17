"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import { FileText, Calendar, Star, Clock } from 'lucide-react'
import DashboardHeader from "../../../components/dashboard/DashboardHeader"
import GuideSidebar from "../../../components/dashboard/guide/GuideSidebar"
import StatCard from "../../../components/dashboard/StatCard"
import GuideReservations from "../../../components/dashboard/guide/GuideReservations"
import reservationApi from "../../../services/reservationApi"

export default function GuideDashboard() {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [notifications] = useState(5)
  const [upcomingReservations, setUpcomingReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        setLoading(true);
        const guideId = localStorage.getItem("guideId");

        if (!guideId) {
          throw new Error("Guide ID not found");
        }

        const parsedGuideId = parseInt(guideId, 10);
        
        if (isNaN(parsedGuideId)) {
          throw new Error("Invalid guide ID format");
        }

        const result = await reservationApi.getUpcomingReservations(parsedGuideId);

        if (result.success) {
          // Ensure data is an array
          const reservationsData = result.data || [];
          const dataArray = Array.isArray(reservationsData) ? reservationsData : [reservationsData];
          setUpcomingReservations(dataArray);
        } else {
          setError(result.message || "Failed to fetch upcoming reservations");
        }
      } catch (err) {
        console.error("Error in fetchUpcomingReservations:", err);
        setError(err.message || "An error occurred while fetching upcoming reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingReservations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <GuideSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <DashboardHeader user={user} notifications={notifications} logout={logout} />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Guide Dashboard</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Welcome back, {user?.lastName || "Guide"}! Here's your activity overview.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Posts" value={stats.totalPosts} icon={<FileText className="w-6 h-6" />} trend={8} />
            <StatCard
              title="Average Rating"
              value={stats.averageRating}
              icon={<Star className="w-6 h-6" />}
              trend={2}
            />
            <StatCard title="Upcoming Tours" value={stats.upcomingTours} icon={<Calendar className="w-6 h-6" />} />
            <StatCard
              title="Response Rate"
              value={`${stats.responseRate}%`}
              icon={<Clock className="w-6 h-6" />}
              trend={5}
            />
          </div>

          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Reservations</h2>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-red-500 dark:text-red-400">{error}</p>
                  </div>
                ) : upcomingReservations.length === 0 ? (
                  <div className="flex items-center justify-center h-32">
                    <p className="text-gray-500 dark:text-gray-400">No upcoming reservations found</p>
                  </div>
                ) : (
                  <GuideReservations reservations={upcomingReservations} />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Performance</h2>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Performance chart placeholder
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Reviews</h2>
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Reviews list placeholder
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}