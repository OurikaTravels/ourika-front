"use client"

import { MapPin, Star, MessageSquare, Award } from "lucide-react"

export default function GuideProfile({ user, stats }) {
  return (
    <div className="space-y-6">

      <div className="flex items-center">
        <img
          src={user?.avatar || "/placeholder.svg?height=64&width=64"}
          alt="Guide profile"
          className="w-16 h-16 rounded-full"
        />
        <div className="ml-4">
          <h3 className="font-medium text-gray-900 dark:text-white">{user?.lastName || "Guide Name"}</h3>
          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-1" />
            Marrakech, Morocco
          </div>
        </div>
      </div>


      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center text-[#ff5c5c]">
            <Star className="w-5 h-5 mr-2" />
            <span className="text-lg font-semibold">{stats.averageRating}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div className="flex items-center text-[#ff5c5c]">
            <MessageSquare className="w-5 h-5 mr-2" />
            <span className="text-lg font-semibold">{stats.totalReviews}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Total Reviews</p>
        </div>
      </div>


      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Certifications</h4>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Award className="w-4 h-4 mr-2 text-[#ff5c5c]" />
            Licensed Mountain Guide
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Award className="w-4 h-4 mr-2 text-[#ff5c5c]" />
            First Aid Certified
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Award className="w-4 h-4 mr-2 text-[#ff5c5c]" />
            Desert Navigation Expert
          </div>
        </div>
      </div>


      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#ff5c5c] rounded-lg hover:bg-[#ff4040] transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  )
}

