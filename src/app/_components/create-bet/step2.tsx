'use client'
import React from "react";
import mike from "~/assets/fighters/kamala.jpeg";
import logan from "~/assets/fighters/trump.jpeg";
import SelectedBetCard from "../bets/SelectedBetCard";
import Image from "next/image";
import useCreateBetStore from "~/store/create-bet";
import { toast } from 'sonner';
import { useReadContract } from "thirdweb/react";
import { contract } from "~/contract";

const CreateBetStep2 = () => {
  const { currentStep, setCurrentStep, side, setSide, oddsSide1, setOddsSide1, oddsSide2, setOddsSide2 } = useCreateBetStore();

  const { data: suggestedOdds1 } = useReadContract({ 
    contract, 
    method: "function globalOddsSide1() view returns (int256)", 
    params: [] 
  });

  const { data: suggestedOdds2 } = useReadContract({ 
    contract, 
    method: "function globalOddsSide2() view returns (int256)", 
    params: [] 
  });

  console.log("suggestedOdds1: ", suggestedOdds1);
  console.log("suggestedOdds2: ", suggestedOdds2);

  const handleNext = () => {
    if (side === null || oddsSide1 === "" || oddsSide2 === "") {
      toast.info("Please select a side and set the odds.");
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSideChange = (side: number) => {
    setSide(side);
  };

  const handleOddsChange = (event: React.ChangeEvent<HTMLInputElement>, side: string) => {
    const value = event.target.value;
    if (/^[+-]?\d*$/.test(value)) {
      if (side === "side1") {
        setOddsSide1(value);
        if (value.startsWith('-')) {
          setOddsSide2(value.replace('-', '+'));
        }
        else if (value.startsWith('+')) {
          setOddsSide2(value.replace('+', '-'));
        }
        else {
          setOddsSide2(`-${value}`);
        }
      } else {
        setOddsSide2(value);
        if (value.startsWith('-')) {
          setOddsSide1(value.replace('-', '+'));
        } 
        else if (value.startsWith('+')) {
          setOddsSide1(value.replace('+', '-'));
        }
        else {
          setOddsSide1(`-${value}`);
        }
      }
    }
  };

  return (
    <div className="pb-24">
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white">
          Select winner and set odds
        </h3>
        <hr className="border-1 my-2 border-[#D32F2F]" />
      </div>
      <div className="mt-4">
        <SelectedBetCard image={mike} name="Kamala Harris" result="Loss" />
      </div>
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white">
          Pick side and position
        </h3>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <div className="space-y-6 pt-2">
        <div className={`flex items-center justify-between rounded-xl bg-[#0a0826] ${
            side === 1 ? "border-2 border-[#D32F2F]" : "border border-transparent"
          } p-4 gap-4 cursor-pointer`} onClick={() => handleSideChange(1)}>
            <input type="radio" name="side" id="1" className="w-20" onChange={() => handleSideChange(1)} checked={side === 1} />
            <Image
              src={mike}
              alt={"mike"}
              width={70}
              height={200}
              className="rounded-xl h-full"
            />
          <div className="flex flex-col gap-2 w-full">
          <h3 className="text-white">
            Kamala Harris
          </h3>
          <input
            type="text"
            placeholder="Odds"
            className="h-10 rounded w-full bg-[#3949AB]/50 text-white border border-[#D32F2F] pl-3"
            value={oddsSide1}
            onChange={(e) => handleOddsChange(e, "side1")}
          />
          <p className="text-[#D32F2F]"
          onClick={() => {
            setOddsSide1("-133");
            setOddsSide2("+117");
          }}
          >
            Use suggested odds
          </p>
          </div>
        </div>
        <div className={`flex items-center justify-between rounded-xl bg-[#0a0826] ${
            side === 2 ? "border-2 border-[#D32F2F]" : "border border-transparent"
          } p-4 gap-4 cursor-pointer`} onClick={() => handleSideChange(2)}>
          {/* select radio button */}
            <input type="radio" name="side" id="2" className="w-20" onChange={() => handleSideChange(2)} checked={side === 2} />
            <Image
              src={logan}
              alt={"mike"}
              width={70}
              height={200}
              className="rounded-xl h-full"
            />
          <div className="flex flex-col gap-2 w-full">
          <h3 className="text-white">
            Donald Trump
          </h3>
          <input
            type="text"
            placeholder="Odds"
            className="h-10 rounded w-full bg-[#3949AB]/50 text-white border border-[#D32F2F] pl-3"
            value={oddsSide2}
            onChange={(e) => handleOddsChange(e, "side2")}
          />
          <p className="text-[#D32F2F]"
           onClick={() => {
            setOddsSide1("-110");
            setOddsSide2("+110");
          }}
          >
            Use suggested odds
          </p>
          </div>
        </div>
        <div>
          <button 
            className="w-full rounded-full bg-[#D32F2F] py-3 px-6 text-white font-bold text-lg transition-all duration-300 hover:bg-[#B71C1C] hover:shadow-lg"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBetStep2;
