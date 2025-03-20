import { Calendar, User, MapPin, Clock } from "lucide-react"

export default function GuideReservations({ reservations }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="bg-[#191b20] rounded-lg p-4 border border-gray-700/50">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-medium text-white truncate">{reservation.trekName || "Trek Name"}</h3>
            <span className="px-2 py-1 text-xs rounded-full bg-[#56acfe]/20 text-[#56acfe]">
              {reservation.status || "Confirmed"}
            </span>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-300">
              <Calendar className="w-4 h-4 mr-2 text-[#fe5532]" />
              <span>{formatDate(reservation.date)}</span>
              <span className="mx-2">•</span>
              <Clock className="w-4 h-4 mr-2 text-[#fe5532]" />
              <span>{formatTime(reservation.date)}</span>
            </div>

            <div className="flex items-center text-gray-300">
              <User className="w-4 h-4 mr-2 text-[#fe5532]" />
              <span>{reservation.touristName || "Tourist Name"}</span>
            </div>

            <div className="flex items-center text-gray-300">
              <MapPin className="w-4 h-4 mr-2 text-[#fe5532]" />
              <span className="truncate">{reservation.location || "Location"}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button className="px-3 py-1.5 text-xs bg-[#232630] text-white rounded hover:bg-gray-700 transition-colors">
              Details
            </button>
            <button className="px-3 py-1.5 text-xs bg-[#fe5532] text-white rounded hover:bg-[#fe5532]/90 transition-colors">
              Contact
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

