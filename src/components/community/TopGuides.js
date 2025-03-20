"use client";

import { useState } from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopGuides({ guides }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Top Guides
        </h3>
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
  );
}

function GuideCard({ guide }) {
  return (
<div className="p-5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md">
  <div className="flex items-start gap-4">
    <Link to={`/guide/${guide.id}`} className="shrink-0 overflow-hidden rounded-full ring-2 ring-gray-100 dark:ring-gray-700 hover:ring-[#ff5c5c] dark:hover:ring-[#ff5c5c] transition-all duration-300">
      <img
        src={`http://localhost:8080/api/uploads/images/${guide.avatar}`}
        alt={guide.name}
        className="w-14 h-14 rounded-full object-cover hover:scale-105 transition-transform duration-300"
      />
    </Link>

    <div className="flex-1 min-w-0">
      <div className="flex items-center mb-1">
        <Link
          to={`/guide/${guide.id}`}
          className="font-semibold text-gray-900 dark:text-white hover:text-[#ff5c5c] dark:hover:text-[#ff5c5c] transition-colors truncate text-lg"
        >
          {guide.name}
        </Link>
        {guide.verified && (
          <div className="ml-2 tooltip" data-tip="Verified Guide">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        @{guide.username}
      </p>

      {guide.location && (
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <MapPin size={16} className="mr-1.5" />
          <span className="truncate">{guide.location}</span>
        </div>
      )}
    </div>
  </div>

  {guide.speciality && (
    <div className="mt-3 ml-18">
      <span className="inline-flex items-center bg-gradient-to-r from-[#ff5c5c]/80 to-[#ff8c7c]/80 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
        {guide.speciality}
      </span>
    </div>
  )}
</div>
  );
}
