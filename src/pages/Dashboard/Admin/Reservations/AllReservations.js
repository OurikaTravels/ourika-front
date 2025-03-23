"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { Search, Loader, Info, Calendar, DollarSign, Clock, User, MapPin, CheckCircle, XCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar"
import reservationApi from "../../../../services/reservationApi"
import guideApi from "../../../../services/guideApi"

export default function AllReservations() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("reservations")
  const [notifications] = useState(3)
  const [reservations, setReservations] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isProcessing, setIsProcessing] = useState(false)
  const [guides, setGuides] = useState([])
  const [isLoadingGuides, setIsLoadingGuides] = useState(false)
  const [selectedGuide, setSelectedGuide] = useState("")
  const [showAssignGuideModal, setShowAssignGuideModal] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)

  useEffect(() => {
    fetchReservations()
    fetchStatistics()
  }, [])

  const fetchReservations = async () => {
    setIsLoading(true)
    try {
      const response = await reservationApi.getAllReservations()
      if (response.success) {
        setReservations(response.data)
      } else {
        setError(response.message || "Failed to fetch reservations")
        toast.error(response.message || "Failed to fetch reservations")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching reservations"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStatistics = async () => {
    setIsLoadingStats(true)
    try {
      const response = await reservationApi.getReservationStatistics()
      if (response.success) {
        setStatistics(response.data)
      } else {
        toast.error(response.message || "Failed to fetch reservation statistics")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching reservation statistics")
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchGuides = async () => {
    setIsLoadingGuides(true)
    try {
      const response = await guideApi.getAllGuides()
      if (response.success) {
        console.log("Guides response:", response.data) // Debug log
        // Filter only validated guides - use isValidateGuide (not isValidatedGuide)
        const validatedGuides = response.data.filter((guide) => guide.isValidateGuide === true)
        console.log("Filtered guides:", validatedGuides) // Debug log
        setGuides(validatedGuides)
      } else {
        toast.error(response.message || "Failed to fetch guides")
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching guides")
    } finally {
      setIsLoadingGuides(false)
    }
  }

  const handleApproveReservation = async (reservationId) => {
    if (window.confirm("Are you sure you want to approve this reservation?")) {
      setIsProcessing(true)
      try {
        const response = await reservationApi.approveReservation(reservationId)
        if (response.success) {
          // Update the reservation in the state
          setReservations(
            reservations.map((reservation) =>
              reservation.id === reservationId ? { ...reservation, status: "APPROVED" } : reservation,
            ),
          )
          toast.success("Reservation approved successfully")
          fetchStatistics() // Refresh statistics
        } else {
          throw new Error(response.message || "Failed to approve reservation")
        }
      } catch (err) {
        const errorMessage = err.message || "An error occurred while approving the reservation"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this reservation? This action cannot be undone.")) {
      setIsProcessing(true)
      try {
        const response = await reservationApi.cancelReservation(reservationId)
        if (response.success) {
          // Update the reservation in the state
          setReservations(
            reservations.map((reservation) =>
              reservation.id === reservationId ? { ...reservation, status: "CANCELLED" } : reservation,
            ),
          )
          toast.success("Reservation cancelled successfully")
          fetchStatistics() // Refresh statistics
        } else {
          throw new Error(response.message || "Failed to cancel reservation")
        }
      } catch (err) {
        const errorMessage = err.message || "An error occurred while cancelling the reservation"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const openAssignGuideModal = (reservation) => {
    setSelectedReservation(reservation)
    setSelectedGuide("")
    setShowAssignGuideModal(true)
    fetchGuides()
  }

  const handleAssignGuide = async () => {
    if (!selectedGuide) {
      toast.error("Please select a guide")
      return
    }

    setIsProcessing(true)
    try {
      const response = await reservationApi.assignGuideToReservation(selectedReservation.id, selectedGuide)
      if (response.success) {
        // Find the guide details
        const assignedGuide = guides.find((guide) => guide.id === Number.parseInt(selectedGuide))

        // Update the reservation in the state with the correct guide object structure
        setReservations(
          reservations.map((reservation) =>
            reservation.id === selectedReservation.id
              ? {
                  ...reservation,
                  guide: {
                    id: assignedGuide.id,
                    firstName: assignedGuide.firstName,
                    lastName: assignedGuide.lastName,
                    email: assignedGuide.email,
                  },
                }
              : reservation,
          ),
        )

        toast.success("Guide assigned successfully")
        setShowAssignGuideModal(false)
      } else {
        throw new Error(response.message || "Failed to assign guide")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while assigning the guide"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    // Apply status filter
    if (statusFilter !== "ALL" && reservation.status !== statusFilter) {
      return false
    }

    // Apply search filter
    const searchLower = searchTerm.toLowerCase()
    return (
      reservation.tourist?.firstName?.toLowerCase().includes(searchLower) ||
      reservation.tourist?.lastName?.toLowerCase().includes(searchLower) ||
      reservation.tourist?.email?.toLowerCase().includes(searchLower) ||
      reservation.trek?.title?.toLowerCase().includes(searchLower) ||
      reservation.guide?.firstName?.toLowerCase()?.includes(searchLower) ||
      reservation.guide?.lastName?.toLowerCase()?.includes(searchLower)
    )
  })

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reservations</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">Manage trek reservations and assign guides</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reservations</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isLoadingStats ? <Loader className="h-6 w-6 animate-spin" /> : statistics?.totalReservations || 0}
                  </h3>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mr-4">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reservations</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isLoadingStats ? (
                      <Loader className="h-6 w-6 animate-spin" />
                    ) : (
                      statistics?.totalPendingReservations || 0
                    )}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reservations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
                />
              </div>
              <div className="flex-shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Reservations Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader className="w-8 h-8 text-[#ff5c5c] animate-spin" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Loading reservations...</span>
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="text-center p-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || statusFilter !== "ALL"
                    ? "No reservations match your search criteria"
                    : "No reservations found."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Reservation ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tourist
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Trek
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Guide
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredReservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">#{reservation.id}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(reservation.reservationDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {reservation.tourist
                                  ? `${reservation.tourist.firstName} ${reservation.tourist.lastName}`
                                  : "Unknown Tourist"}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {reservation.tourist?.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {reservation.trek?.title || "Unknown Trek"}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3 mr-1" />
                            {reservation.trek?.startLocation || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {reservation.guide ? (
                            <div className="flex items-center">
                              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {`${reservation.guide.firstName || ""} ${reservation.guide.lastName || ""}`.trim() ||
                                    "Unknown Guide"}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              No Guide Assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {formatDate(reservation.startDate).split(",")[0]}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            to {formatDate(reservation.endDate).split(",")[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ${reservation.totalPrice?.toFixed(2) || "0.00"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {reservation.status === "APPROVED" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </span>
                          ) : reservation.status === "CANCELLED" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                              <XCircle className="w-3 h-3 mr-1" />
                              Cancelled
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {reservation.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => handleApproveReservation(reservation.id)}
                                  disabled={isProcessing}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 px-2 py-1 rounded-md hover:bg-green-50 dark:hover:bg-green-900/20 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleCancelReservation(reservation.id)}
                                  disabled={isProcessing}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                            {reservation.status === "APPROVED" && !reservation.guide && (
                              <button
                                onClick={() => openAssignGuideModal(reservation)}
                                disabled={isProcessing}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50"
                              >
                                Assign Guide
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Assign Guide Modal */}
      {showAssignGuideModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Assign Guide to Reservation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select a guide to assign to reservation #{selectedReservation?.id} for trek "
              {selectedReservation?.trek?.title}".
            </p>

            {isLoadingGuides ? (
              <div className="flex justify-center items-center py-4">
                <Loader className="w-6 h-6 text-[#ff5c5c] animate-spin" />
                <span className="ml-2 text-gray-600 dark:text-gray-300">Loading guides...</span>
              </div>
            ) : guides.length === 0 ? (
              <div className="text-center py-4 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                <p className="text-amber-600 dark:text-amber-400">
                  No validated guides available. Please validate guides first.
                </p>
              </div>
            ) : (
              <select
                value={selectedGuide}
                onChange={(e) => setSelectedGuide(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent mb-4"
              >
                <option value="">Select a guide</option>
                {guides.map((guide) => (
                  <option key={guide.id} value={guide.id}>
                    {`${guide.firstName || ""} ${guide.lastName || ""}`.trim() || guide.email}
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAssignGuideModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignGuide}
                disabled={isProcessing || !selectedGuide || guides.length === 0}
                className="px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" />
                    Assigning...
                  </>
                ) : (
                  "Assign Guide"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

