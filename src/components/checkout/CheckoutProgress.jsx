import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiCheck } = FiIcons;

const CheckoutProgress = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-4 md:space-x-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              {/* Step Circle */}
              <motion.button
                onClick={() => step.completed && onStepClick(step.id)}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all relative ${
                  currentStep >= step.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-200 text-gray-600'
                } ${step.completed && currentStep !== step.id ? 'cursor-pointer hover:scale-105' : ''}`}
                whileHover={step.completed && currentStep !== step.id ? { scale: 1.05 } : {}}
                whileTap={step.completed && currentStep !== step.id ? { scale: 0.95 } : {}}
                disabled={!step.completed && step.id !== currentStep}
              >
                {step.completed && currentStep > step.id ? (
                  <SafeIcon icon={FiCheck} className="text-lg" />
                ) : (
                  <SafeIcon icon={step.icon} className="text-lg" />
                )}
                
                {/* Active step indicator */}
                {currentStep === step.id && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-300"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Step Info */}
              <div className="text-center mt-3">
                <p className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 hidden md:block">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`w-12 md:w-16 h-0.5 mx-4 transition-all ${
                currentStep > step.id ? 'bg-purple-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Mobile Step Description */}
      <div className="md:hidden text-center mt-4">
        <p className="text-sm text-gray-600">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.description}
        </p>
      </div>
    </div>
  );
};

export default CheckoutProgress;