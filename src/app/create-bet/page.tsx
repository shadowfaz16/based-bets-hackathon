"use client";
import React from "react";
import CreateBetStep1 from "../_components/create-bet/step1";
import CreateBetStep2 from "../_components/create-bet/step2";
import CreateBetStep3 from "../_components/create-bet/step3";
import CreateBetStep4 from "../_components/create-bet/step4";
import useCreateBetStore from "~/store/create-bet";
import CreateBetStep5 from "../_components/create-bet/step5";
import { BsChevronLeft } from "react-icons/bs";
import CreateBetStep6 from "../_components/create-bet/step6";
import Link from "next/link";

const SelectBetPage = () => {
  const { currentStep, setCurrentStep } = useCreateBetStore();

  const handleBack = () => {
    setCurrentStep(currentStep > 1 ? currentStep - 1 : 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CreateBetStep1 />;
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
        return <CreateBetStep1 />;
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="pb-32 pt-6 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto mt-6 mb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-white">Create Bet</h1>
        {currentStep > 1 ? (
          <button onClick={handleBack} className="flex items-center text-white">
            <BsChevronLeft className="text-lg mr-2" />
            Back
          </button>
        ) : (
          <Link href="/explore" className="flex items-center text-white">
            <BsChevronLeft className="text-lg mr-2" />
            Back to explore
          </Link>
        )}
      </div>
      <hr className="border-1 mb-6 border-[#D32F2F]" />

      <div className="mb-8 flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((step) => (
          <React.Fragment key={step}>
            <div
              onClick={() => handleStepClick(step)}
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

      {renderStep()}
    </div>
  );
};

export default SelectBetPage;
