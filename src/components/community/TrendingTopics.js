"use client"

export default function TrendingTopics({ topics }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Trending Topics</h3>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {topics.map((topic, index) => (
            <button
              key={index}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-[#ff5c5c] hover:text-white text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              #{topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
