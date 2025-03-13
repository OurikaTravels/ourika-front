"use client"

import { Calendar, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function GuideReservations({ reservations }) {
  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 dark:text-white">{reservation.tourName}</h3>
            <div className="mt-1 space-y-1">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2" />
                {reservation.date}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                {reservation.time}
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2" />
                {reservation.guests} guests
              </div>
            </div>
          </div>

          <div className="ml-4">
            {reservation.status === "confirmed" ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirmed
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                <AlertCircle className="w-4 h-4 mr-1" />
                Pending
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

