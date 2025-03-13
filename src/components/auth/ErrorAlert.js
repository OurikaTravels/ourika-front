"use client"

export default function ErrorAlert({ error }) {
  if (!error) return null

  return (
    <div
      className="mb-6 bg-red-50 border-l-4 border-[#ff5c5c] p-4 rounded-md animate-in fade-in slide-in-from-top-4 duration-300"
      role="alert"
    >
      <div className="flex items-center">
        <svg className="h-5 w-5 text-[#ff5c5c] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="text-red-800">{error}</span>
      </div>
    </div>
  )
}

