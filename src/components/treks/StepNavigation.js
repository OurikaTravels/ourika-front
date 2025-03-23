"use client"

import { Loader } from "lucide-react"

export function StepNavigation({ onPrevStep, onNextStep, isSubmitting, isLastStep = false }) {
  return (
    <div className="flex justify-between mt-8 pt-4 border-t border-gray-700">
      <button
        type="button"
        onClick={onPrevStep}
        disabled={isSubmitting}
        className="px-4 py-2 bg-[#191b20] text-gray-300 rounded-md hover:bg-[#191b20]/70 transition-colors disabled:opacity-70 border border-gray-700"
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNextStep}
        disabled={isSubmitting}
        className="px-4 py-2 bg-[#fe5532] text-white rounded-md hover:bg-[#fe5532]/90 transition-colors disabled:opacity-70 flex items-center shadow-sm"
      >
        {isSubmitting ? (
          <>
            <Loader className="animate-spin w-4 h-4 mr-2" />
            Saving...
          </>
        ) : isLastStep ? (
          "Complete"
        ) : (
          "Next"
        )}
      </button>
    </div>
  )
}

