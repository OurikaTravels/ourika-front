"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../context/AuthContext"
import {
  Users,
  Map,
  UserCog,
  Calendar,
  DollarSign,
  Star,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  Receipt,
} from "lucide-react"
import DashboardHeader from "../../../components/dashboard/DashboardHeader"
import DashboardSidebar from "../../../components/dashboard/DashboardSidebar"
import StatCard from "../../../components/dashboard/StatCard"
import adminApi from "../../../services/adminApi"
import { toast } from "react-hot-toast"
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [notifications] = useState(3)
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalTourists: 0,
    totalGuides: 0,
    verifiedUsers: 0,
    validatedGuides: 0,
    nonValidatedGuides: 0,
    reservationsCount: 0,
    reservationRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Sample data for charts
  const revenueData = [
    { month: "Jan", revenue: 1200 },
    { month: "Feb", revenue: 1900 },
    { month: "Mar", revenue: 1500 },
    { month: "Apr", revenue: 2100 },
    { month: "May", revenue: 1800 },
    { month: "Jun", revenue: 2400 },
    { month: "Jul", revenue: 980 },
  ]

  const bookingData = [
    { month: "Jan", completed: 12, cancelled: 2 },
    { month: "Feb", completed: 19, cancelled: 3 },
    { month: "Mar", completed: 15, cancelled: 1 },
    { month: "Apr", completed: 21, cancelled: 2 },
    { month: "May", completed: 18, cancelled: 1 },
    { month: "Jun", completed: 24, cancelled: 2 },
    { month: "Jul", completed: 28, cancelled: 3 },
  ]

  useEffect(() => {
    fetchAdminStatistics()
  }, [])

  const fetchAdminStatistics = async () => {
    try {
      const response = await adminApi.getAdminStatistics()
      if (response.success) {
        setStatistics(response.data)
      } else {
        toast.error(response.message || "Failed to fetch statistics")
      }
    } catch (error) {
      toast.error("An error occurred while fetching statistics")
    } finally {
      setIsLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#232630] p-3 border border-[#333] rounded-md shadow-md">
          <p className="text-white text-sm font-medium mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {entry.name === "revenue" ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
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
        <DashboardHeader user={user} logout={logout} />

        <main className="p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
            <p className="mt-1 text-gray-400">Welcome back! Here's what's happening with your platform today.</p>
          </div>

          {/* Key Metrics Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#56acfe]" />
              User Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={isLoading ? "..." : statistics.totalUsers}
                icon={<Users className="w-6 h-6" />}
                trend={12}
                bgClass="bg-gradient-to-br from-[#232630] to-[#2a2d38]"
              />
              <StatCard
                title="Total Tourists"
                value={isLoading ? "..." : statistics.totalTourists}
                icon={<Users className="w-6 h-6" />}
                trend={8}
                bgClass="bg-gradient-to-br from-[#232630] to-[#2a2d38]"
              />
              <StatCard
                title="Total Guides"
                value={isLoading ? "..." : statistics.totalGuides}
                icon={<UserCog className="w-6 h-6" />}
                trend={5}
                bgClass="bg-gradient-to-br from-[#232630] to-[#2a2d38]"
              />
              <StatCard
                title="Verified Users"
                value={isLoading ? "..." : statistics.verifiedUsers}
                icon={<CheckCircle className="w-6 h-6" />}
                trend={-3}
                bgClass="bg-gradient-to-br from-[#232630] to-[#2a2d38]"
              />
            </div>
          </div>

          {/* Guide Metrics Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <UserCog className="w-5 h-5 mr-2 text-[#fe5532]" />
              Guide Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              <StatCard
                title="Validated Guides"
                value={isLoading ? "..." : statistics.validatedGuides}
                icon={<CheckCircle className="w-6 h-6 text-green-500" />}
                trend={15}
                bgClass="bg-gradient-to-br from-[#232630] to-[#2a2d38]"
              />
              <StatCard
                title="Non-Validated Guides"
                value={isLoading ? "..." : statistics.nonValidatedGuides}
                icon={<XCircle className="w-6 h-6 text-[#fe5532]" />}
                trend={2}
                bgClass="bg-gradient-to-br from-[#232630] to-[#2a2d38]"
              />
            </div>
          </div>

          {/* Reservation Metrics Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#56acfe]" />
              Reservation Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <StatCard
                title="Total Reservations"
                value={isLoading ? "..." : statistics.reservationsCount}
                icon={<Calendar className="w-6 h-6" />}
                trend={10}
                bgClass="bg-gradient-to-br from-[#232630] to-[#2a2d38]"
              />
              <StatCard
                title="Total Revenue"
                value={isLoading ? "..." : formatCurrency(statistics.reservationRevenue)}
                icon={<DollarSign className="w-6 h-6" />}
                trend={18}
                bgClass="bg-gradient-to-br from-[#232630] to-[#2a2d38]"
              />
            </div>
          </div>


        </main>
      </div>
    </div>
  )
}

