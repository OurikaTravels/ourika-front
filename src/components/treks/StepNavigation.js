import { Save, Loader, Check } from 'lucide-react'

export function StepNavigation({ onPrevStep, onNextStep, isSubmitting, isLastStep }) {
  return (
    <div className="flex justify-between space-x-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
      {onPrevStep && (
        <button
          onClick={onPrevStep}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-70"
        >
          Back
        </button>
      )}
      <button
        onClick={onNextStep}
        disabled={isSubmitting}
        className="flex items-center px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
            Saving...
          </>
        ) : (
          <>
            {isLastStep ? (
              <Check className="w-5 h-5 mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {isLastStep ? "Complete" : "Save & Continue"}
          </>
        )}
      </button>
    </div>
  )
}
