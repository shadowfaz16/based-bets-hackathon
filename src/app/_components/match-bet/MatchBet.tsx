import React, { useMemo, useState } from "react";
import Image from "next/image";
import { contract } from "~/contract";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import MatchBetCard from "../bets/MatchBetCard";
import { toast } from "sonner";
import { CgSpinnerAlt } from "react-icons/cg";
import pfp from "~/assets/pfp/pfp.png";

interface MatchBetProps {
  id: string;
  onTakeBet: () => void;
}

const MatchBet: React.FC<MatchBetProps> = ({ id, onTakeBet }) => {
  const [showMaker, setShowMaker] = useState(false);
  const address = useActiveAccount();

  const { data, isLoading } = useReadContract({
    contract,
    method: "function bets(uint256) view returns (uint256 id, address addr1, address addr2, uint256 amount, bool matched, uint8 winner, bool withdrawn, uint8 side, string currency, uint256 createdAt, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr, bool cancelled)",
    params: [BigInt(id)],
  });

  const { mutate: sendTransaction, isPending, isIdle } = useSendTransaction();

  const betDetails = useMemo(() => {
    if (!data) return null;

    const [
      id,
      addr1,
      addr2,
      amount,
      matched,
      winner,
      withdrawn,
      side,
      currency,
      createdAt,
      oddsSide1,
      oddsSide2,
      isPrivate,
      whitelistedAddr,
      cancelled,
    ] = data;

    const betAmount = Number(amount) / 10 ** 18;
    const makerOdds = Number(side === 1 ? oddsSide1 : oddsSide2);
    const takerOdds = Number(side === 1 ? oddsSide2 : oddsSide1);

    const calculateAmountToWin = (odds: number, amount: number) => {
      return odds > 0 ? (amount * odds) / 100 : (amount * 100) / Math.abs(odds);
    };

    const makerAmountToWin = calculateAmountToWin(makerOdds, betAmount);
    const takerAmountToWin = calculateAmountToWin(takerOdds, betAmount);

    const feePercentage = 0.05; // 5% fee
    const calculateFee = (amount: number) => amount * feePercentage;
    const calculateTotalPayout = (betAmount: number, amountToWin: number) => betAmount + amountToWin;
    const calculateTotalPayoutAfterFees = (totalPayout: number, fee: number) => totalPayout - fee;
    const calculateDrawReturn = (betAmount: number, fee: number) => betAmount - fee;

    const makerDetails = {
      betAmount,
      amountToWin: makerAmountToWin,
      totalPayout: calculateTotalPayout(betAmount, makerAmountToWin),
      fee: calculateFee(calculateTotalPayout(betAmount, makerAmountToWin)),
      feePercentage,
      totalPayoutAfterFees: calculateTotalPayoutAfterFees(calculateTotalPayout(betAmount, makerAmountToWin), calculateFee(calculateTotalPayout(betAmount, makerAmountToWin))),
      drawReturn: calculateDrawReturn(betAmount, calculateFee(betAmount)),
    };

    const takerDetails = {
      betAmount,
      amountToWin: takerAmountToWin,
      totalPayout: calculateTotalPayout(betAmount, takerAmountToWin),
      fee: calculateFee(calculateTotalPayout(betAmount, takerAmountToWin)),
      feePercentage,
      totalPayoutAfterFees: calculateTotalPayoutAfterFees(calculateTotalPayout(betAmount, takerAmountToWin), calculateFee(calculateTotalPayout(betAmount, takerAmountToWin))),
      drawReturn: calculateDrawReturn(betAmount, calculateFee(betAmount)),
    };

    return {
      id: Number(id),
      addr1,
      addr2,
      amount: betAmount,
      matched,
      winner,
      withdrawn,
      makerSide: side,
      takerSide: side === 1 ? 2 : 1,
      currency,
      createdAt: Number(createdAt),
      makerOdds,
      takerOdds,
      isPrivate,
      whitelistedAddr,
      cancelled,
      maker: makerDetails,
      taker: takerDetails,
    };
  }, [data]);

  const handleTakeBet = () => {
    if (!betDetails) return;

    const transaction = prepareContractCall({
      contract,
      method: "function matchBet(uint256 betId, uint8 side) payable",
      params: [BigInt(id), betDetails.takerSide],
      value: BigInt(Math.round(betDetails.taker.betAmount * 10 ** 18)),
    });

    sendTransaction(transaction, {
      onError: (error) => {
        toast.error(error?.message || "An error occurred");
        console.error("Error: ", error);
      },
      onSuccess: () => {
        toast.success("Bet taken successfully");
        onTakeBet();
      },
    });
  };

  if (isLoading || !betDetails) {
    return <div>Loading...</div>;
  }

  const canTakeBet =
    address?.address !== betDetails.addr1 &&
    address?.address !== betDetails.addr2;
  const currentSide = showMaker ? betDetails.maker : betDetails.taker;

  return (
    <div className="pb-32 pt-6 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto mt-6 mb-24">
      <h1 className="text-3xl font-extrabold text-white mb-6">Match Bet</h1>
      <hr className="border-1 mb-6 border-[#5C6BC0]" />

      <div className="mt-4 cursor-pointer">
        <MatchBetCard
          side={showMaker ? betDetails.makerSide : betDetails.takerSide}
          addr1={betDetails.addr1}
          addr2={betDetails.addr2}
          oddsSide1={data?.[10]}
          oddsSide2={data?.[11]}
        />
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">The bet</h2>
          <div className="flex gap-1 text-sm">
            <button
              className={`rounded-full px-4 py-1 ${!showMaker ? "bg-[#D32F2F] text-white" : "bg-[#3949AB] text-white"}`}
              onClick={() => setShowMaker(false)}
            >
              Taker
            </button>
            <button
              className={`rounded-full px-4 py-1 ${showMaker ? "bg-[#D32F2F] text-white" : "bg-[#3949AB] text-white"}`}
              onClick={() => setShowMaker(true)}
            >
              Maker
            </button>
          </div>
        </div>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Image src={pfp} alt="profile" width={40} height={40} className="rounded-full" />
            <div className="text-white">
              <p className="font-bold">{showMaker ? betDetails.addr1 : "Me"}</p>
              <p className="text-sm text-gray-300">
                {showMaker
                  ? (betDetails.makerSide === 1 ? "Kamala Harris" : "Donald Trump")
                  : (betDetails.takerSide === 1 ? "Kamala Harris" : "Donald Trump")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Wager</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.betAmount.toFixed(4)}
          </p>
          <p className="text-sm text-gray-300">${betDetails.currency}</p>
        </div>
        <div className="bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Odds</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {showMaker
              ? (betDetails.makerOdds > 0 ? "+" : "") + betDetails.makerOdds
              : (betDetails.takerOdds > 0 ? "+" : "") + betDetails.takerOdds}
          </p>
          <p className="text-sm text-gray-300">
            {showMaker
              ? (betDetails.makerSide === 1 ? "Kamala Harris" : "Donald Trump")
              : (betDetails.takerSide === 1 ? "Kamala Harris" : "Donald Trump")}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">To win</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.amountToWin.toFixed(4)} ${betDetails.currency}
          </p>
        </div>
        <div className="bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Total payout</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.totalPayout.toFixed(4)} ${betDetails.currency}
          </p>
          <p className="text-sm text-gray-300">(Bet amount + To win)</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Based.bet fee</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.fee.toFixed(4)} ${betDetails.currency}
          </p>
          <p className="text-sm text-gray-300">({(currentSide.feePercentage * 100).toFixed(2)}%)</p>
        </div>
        <div className="bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Paid if Won</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.totalPayoutAfterFees.toFixed(4)} ${betDetails.currency}
          </p>
          <p className="text-sm text-gray-300">(From contract)</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">If Draw</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.drawReturn.toFixed(4)} ${betDetails.currency}
          </p>
          <p className="text-sm text-gray-300">({(currentSide.feePercentage * 100).toFixed(2)}% fee)</p>
        </div>
        <div className="bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">If Lose</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">0 ${betDetails.currency}</p>
        </div>
      </div>

      {canTakeBet && !showMaker && (
        <div className="mt-8">
          <button
            className="w-full rounded-full bg-[#D32F2F] px-6 py-3 text-white font-bold text-lg text-center transition-all duration-300 hover:bg-[#B71C1C] hover:shadow-lg"
            onClick={handleTakeBet}
            disabled={isPending && !isIdle}
          >
            {isPending ? (
              <>
                <CgSpinnerAlt className="mr-2 animate-spin" />
                Matching bet...
              </>
            ) : (
              "Take bet"
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchBet;