import React from "react";

interface StepTrackerProps {
  steps: number;
  currentStep: number; // 1-based index
}

export const StepTracker: React.FC<StepTrackerProps> = ({ steps, currentStep }) => (
  <nav
    className="
      flex items-center justify-center
      w-full max-w-xs sm:max-w-lg
      px-2 sm:px-4
      mx-auto
      overflow-x-hidden
      select-none
      py-4
      "
    aria-label="Progress"
  >
    {Array.from({ length: steps * 2 - 1 }).map((_, idx) => {
      if (idx % 2 === 0) {
        // Circle
        const stepNum = Math.floor(idx / 2) + 1;
        const isActive = stepNum <= currentStep;
        return (
          <div
            key={`step-${stepNum}`}
            className={`
              flex items-center justify-center
              rounded-full
              font-medium
              text-xs sm:text-base
              transition-colors
              shrink-0
              ${isActive
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-gray-500"
              }
              w-6 h-6 sm:w-8 sm:h-8
              `}
            aria-current={isActive && stepNum === currentStep ? "step" : undefined}
            aria-label={`Step ${stepNum}${isActive && stepNum === currentStep ? " (current)" : ""}`}
            tabIndex={0}
            role="listitem"
          >
            {stepNum}
          </div>
        );
      } else {
        // Line
        return (
          <div
            key={`line-${idx}`}
            className={`
              h-0.5 sm:h-1
              bg-gray-300
              flex-shrink-0
              mx-1 sm:mx-2
              w-6 sm:w-10
              rounded
              `}
            aria-hidden="true"
          />
        );
      }
    })}
  </nav>
);
