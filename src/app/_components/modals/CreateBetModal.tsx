import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCreateBetStore from "~/store/create-bet";
import CreateBetStep2 from "../create-bet/step2";
import CreateBetStep3 from "../create-bet/step3";
import CreateBetStep4 from "../create-bet/step4";
import CreateBetStep5 from "../create-bet/step5";
import CreateBetStep6 from "../create-bet/step6";
import { BsChevronLeft } from "react-icons/bs";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

const CreateBetModal: React.FC<Props> = ({ onClose, children }) => {
  const { currentStep, setCurrentStep } = useCreateBetStore();
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (modalRef.current) {
        const viewportHeight = window.innerHeight;
        const maxHeight = viewportHeight * 0.8; // 80% of viewport height
        modalRef.current.style.maxHeight = `${maxHeight}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return children;
      case 2:
        return <CreateBetStep2 />;
      case 3:
        return <CreateBetStep3 />;
      case 4:
        return <CreateBetStep4 />;
      case 5:
        return <CreateBetStep5 />;
      case 6:
        return <CreateBetStep6 />;
      default:
        return children;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black bg-opacity-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="w-full max-w-md rounded-lg bg-[#1A237E] p-6 shadow-xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{ maxHeight: '80vh', maxWidth: '46rem' }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              {currentStep > 1 && (
                <button onClick={handleBack} className="mr-2 text-white">
                  <BsChevronLeft size={24} />
                </button>
              )}
              <h2 className="text-2xl font-bold text-white">Create Bet</h2>
            </div>
            <button onClick={onClose} className="text-white">&times;</button>
          </div>

          <div className="mb-4 flex items-center justify-center">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 ${
                    step < currentStep
                      ? "border-[#D32F2F] bg-[#D32F2F] text-white"
                      : step === currentStep
                        ? "border-[#D32F2F] text-white"
                        : "border-gray-400 text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 5 && <div className="mx-1 h-0.5 w-4 bg-[#D32F2F]"></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="flex-grow overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {isLoading && (
            <div className="mt-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-[#D32F2F]"></div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateBetModal;