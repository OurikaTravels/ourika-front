"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import reservationApi from "../../services/reservationApi"
import {
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader,
  CalendarDays,
  ChevronRight,
  ArrowRight,
  Users,
  Baby,
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"
import BookingHeader from "./BookingHeader"

const statusConfig = {
  PENDING: {
    color: "bg-amber-100 text-amber-800 border-amber-200",
    icon: <AlertCircle className="w-5 h-5" />,
    label: "Awaiting Confirmation",
  },
  APPROVED: {
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: <CheckCircle className="w-5 h-5" />,
    label: "Confirmed",
  },
  REJECTED: {
    color: "bg-rose-100 text-rose-800 border-rose-200",
    icon: <XCircle className="w-5 h-5" />,
    label: "Rejected",
  },
  CANCELLED: {
    color: "bg-slate-100 text-slate-800 border-slate-200",
    icon: <XCircle className="w-5 h-5" />,
    label: "Cancelled",
  },
}

const BookingsPage = () => {
  const { user } = useAuth()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.id) return

      setLoading(true)
      const response = await reservationApi.getTouristReservations(user.id)
      console.log(response)
      if (response.success) {
        setReservations(response.data)
      } else {
        setError(response.message)
      }
      setLoading(false)
    }

    fetchReservations()
  }, [user])

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this reservation? This action cannot be undone.")) {
      setIsProcessing(true)
      setProcessingId(reservationId)
      try {
        const response = await reservationApi.cancelReservation(reservationId)
        if (response.success) {
          setReservations(
            reservations.map((reservation) =>
              reservation.id === reservationId ? { ...reservation, status: "CANCELLED" } : reservation,
            ),
          )
          toast.success("Reservation cancelled successfully")
        } else {
          throw new Error(response.message || "Failed to cancel reservation")
        }
      } catch (err) {
        const errorMessage = err.message || "An error occurred while cancelling the reservation"
        toast.error(errorMessage)
      } finally {
        setIsProcessing(false)
        setProcessingId(null)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#049769] border-t-transparent mb-4"></div>
        <p className="text-gray-600 animate-pulse">Loading your bookings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen ">
        <BookingHeader />
        <div className="bg-gradient-to-br from-[#0f172a]/5 to-[#1e293b]/10 rounded-2xl p-10 border border-gray-200 shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-[#049769]/20 to-[#049769]/20 rounded-full flex items-center justify-center mb-8 border-2 border-[#049769]/30">
              <MapPin className="w-14 h-14 text-[#049769]" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">Discover Ourika's Treasures</h2>
            <p className="text-gray-600 max-w-lg mb-10 text-lg">
              Embark on an unforgettable journey through Morocco's breathtaking landscapes. Explore our handpicked treks
              and create memories that will last a lifetime.
            </p>

            <Link
              to="/"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#049769] to-[#049769] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="text-lg">Explore Ourika Treks</span>
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (reservations.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-600 mb-12">View and manage your trek reservations</p>

        <div className="bg-gradient-to-br from-[#0f172a]/5 to-[#1e293b]/10 rounded-2xl p-10 border border-gray-200 shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-[#049769]/20 to-[#049769]/20 rounded-full flex items-center justify-center mb-8 border-2 border-[#049769]/30">
              <MapPin className="w-14 h-14 text-[#049769]" />
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-4">Explore Ourika's Wonders</h2>
            <p className="text-gray-600 max-w-lg mb-10 text-lg">
              Begin your Moroccan adventure with our exceptional treks through stunning landscapes, ancient villages,
              and majestic mountains. Your journey awaits!
            </p>

            <Link
              to="/treks"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#049769] to-[#049769] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="text-lg">Explore Ourika Treks</span>
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
      <p className="text-gray-600 mb-8">View and manage your trek reservations</p>

      <div className="space-y-6">
        {reservations.map((reservation) => {
          const status = statusConfig[reservation.status]
          const isPastTrip = new Date(reservation.endDate) < new Date()

          return (
            <div
              key={reservation.id}
              className="border rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md "
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 lg:w-1/4 relative">
                  <div className="aspect-video md:aspect-square w-full h-full">
                    <img
                      src={
                        reservation.trek.images.find((img) => img.isPrimary)?.path
                          ? `http://localhost:8080/api/uploads/images/${
                              reservation.trek.images.find((img) => img.isPrimary).path
                            }`
                          : "/placeholder.svg?height=300&width=400"
                      }
                      alt={reservation.trek.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=300&width=400"
                      }}
                    />
                  </div>

                  <div
                    className={`absolute top-4 left-4 md:hidden px-3 py-1.5 rounded-full flex items-center ${status.color}`}
                  >
                    {status.icon}
                    <span className="ml-1.5 text-sm font-medium">{status.label}</span>
                  </div>
                </div>
                <div className="flex-1 p-5 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{reservation.trek.title}</h2>

                      <div
                        className={`hidden md:flex items-center px-3 py-1.5 rounded-full w-fit mb-4 ${status.color}`}
                      >
                        {status.icon}
                        <span className="ml-1.5 text-sm font-medium">{status.label}</span>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {reservation.trek.description ||
                          "Experience this amazing trek through beautiful landscapes and discover hidden gems along the way."}
                      </p>
                    </div>

                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Users size={14} className="mr-1" />
                      <span>Adults: {reservation.adultCount}</span>
                      {reservation.childCount > 0 && (
                        <>
                          <span className="mx-1">•</span>
                          <Baby size={14} className="mr-1" />
                          <span>Children: {reservation.childCount}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <CalendarDays className="h-5 w-5 text-[#049769]" />
                      <div className="ml-3">
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-sm font-medium">
                          {format(new Date(reservation.startDate), "MMM dd")} -{" "}
                          {format(new Date(reservation.endDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-[#049769]" />
                      <div className="ml-3">
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium line-clamp-1">
                          {reservation.trek.startLocation || "Marrakech"} to{" "}
                          {reservation.trek.endLocation || "Atlas Mountains"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-[#049769]" />
                      <div className="ml-3">
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium">
                          {reservation.trek.duration?.replace("PT", "").replace("H", " hours") || "Full day"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {reservation.guide && (
                    <div className="mt-5 pt-5 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            src={
                              `http://localhost:8080/api/uploads/images/${reservation.guide.profileImage || "/placeholder.svg"}` ||
                              "/placeholder.svg?height=40&width=40"
                            }
                            alt={`${reservation.guide.firstName} ${reservation.guide.lastName}`}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/placeholder.svg?height=40&width=40"
                            }}
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            Guide: {reservation.guide.firstName} {reservation.guide.lastName}
                          </p>
                          <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                            <span>{reservation.guide.speciality || "Mountain Guide"}</span>
                            <span>•</span>
                            <span>{reservation.guide.experience || "5"} years experience</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <span className="text-xs text-gray-500">
                      Booked on {format(new Date(reservation.reservationDate), "MMMM dd, yyyy")}
                    </span>

                    {(reservation.status === "PENDING" || reservation.status === "APPROVED") && !isPastTrip && (
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        disabled={isProcessing}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium
                          ${
                            isProcessing && processingId === reservation.id
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                          }`}
                      >
                        {isProcessing && processingId === reservation.id ? (
                          <div className="flex items-center">
                            <Loader className="animate-spin w-4 h-4 mr-2" />
                            <span>Cancelling...</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <XCircle className="w-4 h-4 mr-2" />
                            <span>Cancel Booking</span>
                          </div>
                        )}
                      </button>
                    )}

                    <Link
                      to={`/treks/${reservation.trek.id}`}
                      className="px-4 py-2 bg-[#049769] text-white rounded-lg hover:bg-[#049769] transition-all duration-300 text-sm font-medium flex items-center"
                    >
                      View Trek Details
                      <ChevronRight className="ml-1 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BookingsPage

