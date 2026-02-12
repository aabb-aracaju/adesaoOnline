import React from 'react';
import { Check } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
        <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-aabb-blue transition-all duration-300 -z-10 rounded-full"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
        
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={index} className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 transition-all duration-300 bg-white
                ${isCompleted ? 'border-aabb-blue bg-aabb-blue text-white' : ''}
                ${isCurrent ? 'border-aabb-blue text-aabb-blue shadow-[0_0_0_4px_rgba(0,51,153,0.2)]' : ''}
                ${!isCompleted && !isCurrent ? 'border-gray-300 text-gray-400' : ''}
                `}
              >
                {isCompleted ? <Check size={16} /> : stepNum}
              </div>
              <span className={`hidden md:block absolute -bottom-6 text-xs font-medium w-24 text-center ${isCurrent ? 'text-aabb-blue' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};