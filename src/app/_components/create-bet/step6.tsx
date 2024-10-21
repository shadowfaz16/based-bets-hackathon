import React from "react";
import Link from "next/link";
import useCreateBetStore from "~/store/create-bet";
import { toast } from "sonner";
import { useReadContract } from "thirdweb/react";
import {contract} from "~/contract";
import BetCard from "../bets/BetCard";

const CreateBetStep6 = () => {
  const { side } = useCreateBetStore();

  const { data: betCount } = useReadContract({ 
    contract, 
    method: "function betCount() view returns (uint256)", 
    params: [] 
  });

  const betNumber = Number(betCount) || 0;

  return (
    <div className="pb-24">
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white">Bet approved</h3>
        <hr className="border-1 my-4 border-[#D32F2F]" />
      </div>
      <div className="mt-4">
        <BetCard side={side} />
      </div>
      <div className="flex flex-col gap-6 mt-8">
        <button
          className="w-full rounded-full bg-[#D32F2F] px-6 py-3 text-white font-bold text-lg transition-all duration-300 hover:bg-[#B71C1C] hover:shadow-lg"
          onClick={() => {
            void navigator.clipboard.writeText(
              `${window.location.origin}/take-bet/${betNumber}`,
            );
            toast.success("Bet url copied to clipboard");
          }}
        >
          Copy bet url
        </button>
        <Link
          href="/explore"
          className="w-full rounded-full border-2 border-[#D32F2F] px-6 py-3 text-center text-white font-bold text-lg transition-all duration-300 hover:bg-[#D32F2F] hover:shadow-lg"
        >
          Explore bets
        </Link>
        <Link
          href="/my-bets"
          className="w-full rounded-full border-2 border-[#D32F2F] px-6 py-3 text-center text-white font-bold text-lg transition-all duration-300 hover:bg-[#D32F2F] hover:shadow-lg"
        >
          My bets
        </Link>
      </div>
    </div>
  );
};

export default CreateBetStep6;
