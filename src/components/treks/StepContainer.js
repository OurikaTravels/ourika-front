import { Loader } from 'lucide-react'

export function StepContainer({ title, children, isLoading, loadingText }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{title}</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader className="w-8 h-8 text-[#ff5c5c] animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">{loadingText || "Loading..."}</span>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
