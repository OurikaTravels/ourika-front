"use client"

import { useState } from "react"
import { Star, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export default function TopGuides({ guides }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Top Guides</h3>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      <div className="p-4 text-center">
        <button className="text-[#ff5c5c] hover:text-[#ff4040] font-medium text-sm transition-colors">
          View all guides
        </button>
      </div>
    </div>
  )
}

function GuideCard({ guide }) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-start space-x-3">
        <Link to={`/guide/${guide.username}`}>
          <img
            src={guide.avatar || "/placeholder.svg?height=48&width=48"}
            alt={guide.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <Link
              to={`/guide/${guide.username}`}
              className="font-medium text-gray-900 dark:text-white hover:text-[#ff5c5c] dark:hover:text-[#ff5c5c] transition-colors truncate"
            >
              {guide.name}
            </Link>
            {guide.verified && (
              <svg className="w-4 h-4 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{guide.username}</p>

          <div className="flex items-center mt-1 text-sm">
            <div className="flex items-center text-yellow-500 mr-3">
              <Star size={14} className="fill-current" />
              <span className="ml-1">{guide.rating}</span>
            </div>

            {guide.location && (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <MapPin size={14} />
                <span className="ml-1 truncate">{guide.location}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsFollowing(!isFollowing)}
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            isFollowing
              ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              : "bg-[#ff5c5c] text-white hover:bg-[#ff4040]"
          } transition-colors`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      {guide.speciality && (
        <div className="mt-2 pl-14">
          <span className="inline-block bg-[#ff5c5c] bg-opacity-10 text-[#ff5c5c] px-2 py-0.5 rounded-full text-xs">
            {guide.speciality}
          </span>
        </div>
      )}
    </div>
  )
}

