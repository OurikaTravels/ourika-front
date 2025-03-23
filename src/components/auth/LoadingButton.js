"use client"

import { ArrowRight } from "lucide-react"

export default function LoadingButton({ isLoading, children, className = "", ...props }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#049769] focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {isLoading ? "Processing..." : children}
        </div>
      ) : (
        <div className="flex items-center">
          {children}
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </button>
  )
}

