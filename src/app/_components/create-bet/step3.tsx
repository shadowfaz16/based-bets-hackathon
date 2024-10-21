"use client";
import React from "react";
import mike from "~/assets/fighters/kamala.jpeg";
import logan from "~/assets/fighters/trump.jpeg";
import BetWinnerCard from "../bets/BetWinnerCard";
import useCreateBetStore from "~/store/create-bet";
import { getWalletBalance } from "thirdweb/wallets";
import { useBalance } from "@thirdweb-dev/react";
import { toast } from "sonner";


const CreateBetStep3 = () => {
  const {
    amount,
    setAmount,
    currency,
    setCurrency,
    currentStep,
    setCurrentStep,
    side,
    oddsSide1,
    oddsSide2,
  } = useCreateBetStore();

  // const { data: eth_balance } = useBalance();

  const handleNext = () => {
    if (amount === null || amount === 0 || currency === "") {
      toast.info("Please set the amount and currency.");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    console.log("New Currency Is: ", event.target.value);
    setCurrency(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value === "" ? 0 : parseFloat(value));
    }
  };

  const handleIncrement = () => {
    let increment = 0;
    if (currency === "USDT") increment = 50;
    else if (currency === "USDC") increment = 50;
    else if (currency === "ETH") increment = .1;
    else if (currency === "BBX") increment = 100;
    const updatedAmount = (amount || 0) + increment;
    setAmount(updatedAmount);
  };

  const handleDecrement = () => {
    let decrement = 0;
    if (currency === "USDT") decrement = 50;
    else if (currency === "USDC") decrement = 50;
    else if (currency === "ETH") decrement = .1;
    else if (currency === "BBX") decrement = 10;
    const updatedAmount = Math.max((amount || 0) - decrement, 0);
    setAmount(updatedAmount);
  };

  return (
    <div className="pb-24">
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white">
          Bet currency and Amount
        </h3>
        <hr className="border-1 my-2 border-[#D32F2F]" />
      </div>
      <div className="mt-4">
        <BetWinnerCard
          image={side === 1 ? mike : logan}
          name={side === 1 ? "Kamala Harris" : "Donald Trump"}
          odds={side === 1 ? oddsSide1 : oddsSide2}
        />
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white">Currency</h3>
        <hr className="border-1 my-4 border-[#D32F2F]" />
        <div className="relative">
          <select
            className="w-full appearance-none rounded border border-[#D32F2F] bg-[#0a0826] py-2 pl-3 pr-10 text-white"
            name="currency"
            id="currency"
            value={currency}
            onChange={handleCurrencyChange}
          >
            {/* <option value="DMCRCY">DMCRCY (5% fee) (Coming Soon!)</option> */}
            <option value="ETH">ETH (1% fee)</option>
            {/* <option value="USDT">USDT (1% fee)</option>
            <option value="USDC">USDC (1% fee)</option> */}
            {/* <option value="USDT">USDT (8% fee)</option> */}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg
              className="h-4 w-4 fill-current text-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 12l-4-4h8z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-white">Set amount</h3>
        <hr className="border-1 my-4 border-[#D32F2F]" />
        <div className="flex items-center gap-2">
          <button
            className="rounded-md bg-[#D32F2F] px-3 py-2"
            onClick={handleDecrement}
          >
            <h3 className="text-white">-</h3>
          </button>
          <input
            type="number"
            className="w-full rounded border border-[#D32F2F] bg-[#0a0826] py-2 pl-3 pr-10 text-white placeholder:text-white/80 focus:outline-none"
            placeholder="Enter amount..."
            value={amount}
            onChange={handleAmountChange}
          />
          <button
            className="rounded-md bg-[#D32F2F] py-2 px-3"
            onClick={handleIncrement}
          >
            <h3 className="text-white">+</h3>
          </button>
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

export default CreateBetStep3;
