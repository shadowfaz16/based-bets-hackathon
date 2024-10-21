'use client'
import React, { useState } from "react";
import mike from "~/assets/fighters/kamala.jpeg";
import logan from "~/assets/fighters/trump.jpeg";
import BetWinnerCard from "../bets/BetWinnerCard";
import useCreateBetStore from "~/store/create-bet";

const CreateBetStep4 = () => {
  const { currentStep, setCurrentStep, oddsSide1, oddsSide2, side, amount, currency, setBetIsPrivate, setWhitelistAddress } = useCreateBetStore();

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };
  
  const [selectedOption, setSelectedOption] = useState("public");

  const handleSelect = (option: React.SetStateAction<string>) => {
    setSelectedOption(option);
    setBetIsPrivate(option === "private");
  };

  return (
    <div className="pb-24">
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white">Who can accept the bet?</h3>
        <hr className="border-1 my-4 border-[#D32F2F]" />
      </div>
      <div className="mt-4">
        <BetWinnerCard image={side === 1 ? mike : logan} name={side === 1 ? "Kamala Harris" : "Donald Trump"} odds={side === 1 ? oddsSide1 : oddsSide2} amount={amount} currency={currency} />
      </div>
      <div className="mt-6">
        <div
          className={`cursor-pointer p-4 rounded-xl bg-[#0a0826] ${
            selectedOption === "public" ? "border-2 border-[#D32F2F]" : "border border-transparent"
          }`}
          onClick={() => {
            handleSelect("public");
            setWhitelistAddress("0x0000000000000000000000000000000000000000");
          }}
        >
          <label className="text-white text-lg">Bet is public</label>
        </div>
      </div>
      <div className="mt-6">
        <div
          className={`cursor-pointer p-4 rounded-xl bg-[#0a0826] ${
            selectedOption === "private" ? "border-2 border-[#D32F2F]" : "border border-transparent"
          }`}
          onClick={() => handleSelect("private")}
        >
          <label className="text-white text-lg">Bet is private</label>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Enter wallet address..."
              className="w-full p-2 mt-2 rounded-lg bg-[#0a0826] border border-[#D32F2F] text-white"
              onChange={(e) => setWhitelistAddress(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <button 
          className="w-full rounded-full bg-[#D32F2F] py-3 px-6 text-white font-bold text-lg transition-all duration-300 hover:bg-[#B71C1C] hover:shadow-lg"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CreateBetStep4;
