"use client"
import { Star, MapPin, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function TopGuides({ guides }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden max-w-md mx-auto">
      <div className="p-4 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white">
        <h3 className="font-semibold text-emerald-800 flex items-center">
          <Star className="w-5 h-5 mr-2 text-emerald-600" />
          Top Guides
        </h3>
      </div>

      <div className="divide-y divide-emerald-100">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      <div className="p-4 text-center bg-gradient-to-r from-white to-emerald-50">
        <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors hover:underline">
          View all guides
        </button>
      </div>
    </div>
  )
}

function GuideCard({ guide }) {
  return (
    <div className="p-4 hover:bg-emerald-50 transition-all duration-300 border-l-4 border-transparent hover:border-emerald-500">
      <div className="flex items-start gap-4">
        <Link
          to={`/guide/${guide.id}`}
          className="shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-100 hover:ring-emerald-500 transition-all duration-300"
        >
          <img
            src={`http://localhost:8080/api/uploads/images/${guide.avatar}`}
            alt={guide.name}
            className="w-12 h-12 rounded-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
            <Link
              to={`/guide/${guide.id}`}
              className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors truncate text-lg"
            >
              {guide.name}
            </Link>
            {guide.verified && (
              <div className="ml-2 tooltip" data-tip="Verified Guide">
                <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-100" />
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 mb-2">@{guide.username}</p>

          {guide.location && (
            <div className="flex items-center text-gray-500 text-sm">
              <MapPin size={16} className="mr-1.5 text-emerald-500" />
              <span className="truncate">{guide.location}</span>
            </div>
          )}
        </div>
      </div>

      {guide.speciality && (
        <div className="mt-3 ml-18">
          <span className="inline-flex items-center bg-gradient-to-r from-emerald-500/80 to-teal-400/80 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
            {guide.speciality}
          </span>
        </div>
      )}
    </div>
  )
}

