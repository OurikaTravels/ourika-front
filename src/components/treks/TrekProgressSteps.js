export function TrekProgressSteps({ steps, currentStep }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex-1 relative ${
              step.id !== steps.length
                ? "after:content-[''] after:absolute after:w-full after:h-0.5 after:top-1/2 after:translate-y-1/2 after:left-1/2 after:bg-gray-700"
                : ""
            }`}
          >
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step.id < currentStep
                    ? "bg-[#fe5532] text-white"
                    : step.id === currentStep
                      ? "bg-[#fe5532]/20 text-[#fe5532] border-2 border-[#fe5532]"
                      : "bg-[#232630] text-gray-400 border border-gray-700"
                }`}
              >
                {step.id}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${step.id === currentStep ? "text-white" : "text-gray-400"}`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 hidden md:block">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

