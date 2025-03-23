import { Loader } from "lucide-react"

export function StepContainer({ title, children, isLoading, loadingText }) {
  return (
    <div className="space-y-6">
      {title && <h2 className="text-xl font-semibold text-white">{title}</h2>}

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader className="w-8 h-8 text-[#fe5532] animate-spin" />
          <span className="ml-2 text-gray-400">{loadingText || "Loading..."}</span>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

