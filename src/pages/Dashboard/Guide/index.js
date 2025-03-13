"use client"

import { useAuth } from "../../../context/AuthContext"

export default function GuideDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Guide Dashboard</h1>
          <div className="flex items-center">
            <span className="mr-4">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
              <h2 className="text-xl font-semibold mb-4">Guide Features</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Tour Management</li>
                <li>Schedule Overview</li>
                <li>Customer Reviews</li>
                <li>Booking Calendar</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

