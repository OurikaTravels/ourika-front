"use client"

export default function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-transform hover:transform hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-[#ff5c5c]/10 text-[#ff5c5c]">{icon}</div>
        {trend !== undefined && (
          <span className={`text-sm font-medium ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  )
}

