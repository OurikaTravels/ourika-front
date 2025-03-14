import { Check } from 'lucide-react'

export function TrekProgressSteps({ steps, currentStep }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li
            key={step.id}
            className={`relative ${stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""} ${
              stepIdx !== 0 ? "pl-4 sm:pl-8" : ""
            } flex-1`}
          >
            {step.id < currentStep ? (
              <div className="group">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ff5c5c] group-hover:bg-[#ff4040]">
                    <Check className="h-5 w-5 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">{step.name}</span>
                </span>
                {stepIdx !== steps.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full sm:w-full bg-[#ff5c5c]"
                    aria-hidden="true"
                  />
                )}
              </div>
            ) : step.id === currentStep ? (
              <div className="group" aria-current="step">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#ff5c5c] bg-white dark:bg-gray-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5c5c]" aria-hidden="true" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-[#ff5c5c]">{step.name}</span>
                </span>
                {stepIdx !== steps.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full sm:w-full bg-gray-300 dark:bg-gray-600"
                    aria-hidden="true"
                  />
                )}
              </div>
            ) : (
              <div className="group">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" aria-hidden="true" />
                  </span>
                  <span className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">{step.name}</span>
                </span>
                {stepIdx !== steps.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px mt-0.5 h-0.5 w-full sm:w-full bg-gray-300 dark:bg-gray-600"
                    aria-hidden="true"
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
