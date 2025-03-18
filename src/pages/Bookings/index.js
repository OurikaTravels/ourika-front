import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import reservationApi from "../../services/reservationApi";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

const statusIcons = {
  PENDING: <AlertCircle className="w-5 h-5" />,
  APPROVED: <CheckCircle className="w-5 h-5" />,
  REJECTED: <XCircle className="w-5 h-5" />,
  CANCELLED: <XCircle className="w-5 h-5" />,
};

const BookingsPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      const response = await reservationApi.getTouristReservations(user.id);
      
      if (response.success) {
        setReservations(response.data);
      } else {
        setError(response.message);
      }
      setLoading(false);
    };

    fetchReservations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5d5d]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const handleCancelReservation = async (reservationId) => {
    if (window.confirm("Are you sure you want to cancel this reservation? This action cannot be undone.")) {
      setIsProcessing(true);
      try {
        const response = await reservationApi.cancelReservation(reservationId);
        if (response.success) {
          setReservations(
            reservations.map((reservation) =>
              reservation.id === reservationId ? { ...reservation, status: "CANCELLED" } : reservation
            )
          );
          toast.success("Reservation cancelled successfully");
        } else {
          throw new Error(response.message || "Failed to cancel reservation");
        }
      } catch (err) {
        const errorMessage = err.message || "An error occurred while cancelling the reservation";
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className={`border rounded-lg p-4 ${
              theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {reservation.trek.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {reservation.trek.description}
                </p>
              </div>
              <div className={`flex items-center px-3 py-1 rounded-full ${statusColors[reservation.status]}`}>
                {statusIcons[reservation.status]}
                <span className="ml-2 text-sm font-medium">
                  {reservation.status}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-600">
                  {format(new Date(reservation.startDate), "MMM dd, yyyy")} - 
                  {format(new Date(reservation.endDate), "MMM dd, yyyy")}
                </span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-600">
                  {reservation.trek.startLocation} to {reservation.trek.endLocation}
                </span>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-600">
                  Duration: {reservation.trek.duration.replace('PT', '').replace('H', ' hours')}
                </span>
              </div>
            </div>

            {reservation.guide && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-sm font-medium text-gray-900">Assigned Guide</h3>
                <div className="mt-3 flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full bg-gray-200"
                      src={reservation.guide.profileImage || "https://via.placeholder.com/40"}
                      alt={`${reservation.guide.firstName} ${reservation.guide.lastName}`}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {reservation.guide.firstName} {reservation.guide.lastName}
                    </p>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{reservation.guide.speciality}</span>
                      <span>•</span>
                      <span>{reservation.guide.experience} years experience</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Booked on {format(new Date(reservation.reservationDate), "MMM dd, yyyy")}
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  ${reservation.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {statusIcons[reservation.status]}
                <span className={`px-2 py-1 rounded-full text-sm ${statusColors[reservation.status]}`}>
                  {reservation.status}
                </span>
              </div>
              
              {/* Add Cancel button only for PENDING or APPROVED status */}
              {(reservation.status === "PENDING" || reservation.status === "APPROVED") && (
                <button
                  onClick={() => handleCancelReservation(reservation.id)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="animate-spin w-4 h-4" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Booking</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        
        {reservations.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No bookings found
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
