"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { contract } from "~/contract";
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react";
import { useParams, useRouter } from "next/navigation";
import { prepareContractCall } from "thirdweb";
import { BsChevronLeft } from "react-icons/bs";
import MatchBetCard from "~/app/_components/bets/MatchBetCard";
import { toast } from "sonner";
import { CgSpinnerAlt } from "react-icons/cg";
import Image from "next/image";
import pfp from "~/assets/pfp/pfp.png";
import { motion } from "framer-motion";

const MatchBet = () => {
  const params = useParams();
  const address = useActiveAccount();
  const id = Number(params.id);
  const [showMaker, setShowMaker] = useState(false);
  const router = useRouter();

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

    const makerAmount = Number(amount) / 10 ** 18;
    const makerSide = Number(side);
    const takerSide = makerSide === 1 ? 2 : 1;
    const makerOdds = makerSide === 1 ? Number(oddsSide1) : Number(oddsSide2);
    const takerOdds = makerSide === 1 ? Number(oddsSide2) : Number(oddsSide1);
    const betIsPrivate = Number(isPrivate);
    const whitelistedAddress = String(whitelistedAddr);
    const betIsCancelled = Number(cancelled);

    const calculateAmounts = (betAmount: number, odds: number) => {
      let amountToWin;
      if (odds > 0) {
        amountToWin = (betAmount * odds) / 100;
      } else {
        amountToWin = (betAmount * 100) / Math.abs(odds);
      }
      return { betAmount, amountToWin };
    };

    const makerCalc = calculateAmounts(makerAmount, makerOdds);
    const takerCalc = calculateAmounts(makerCalc.amountToWin, takerOdds);

    const calculatePayout = (
      betAmount: number,
      amountToWin: number,
      currency: string,
      isMaker: boolean,
    ) => {
      const totalPayout = betAmount + amountToWin;
      const feePercentage = isMaker
        ? currency === "BBX"
          ? 0.05
          : 0.08
        : currency === "BBX"
          ? 0.05
          : 0.08;
      const fee = totalPayout * feePercentage;
      return {
        totalPayout,
        fee,
        feePercentage,
        totalPayoutAfterFees: totalPayout - fee,
        drawReturn: betAmount * (1 - feePercentage),
      };
    };

    const makerPayout = calculatePayout(
      makerCalc.betAmount,
      makerCalc.amountToWin,
      currency,
      true,
    );
    const takerPayout = calculatePayout(
      takerCalc.betAmount,
      takerCalc.amountToWin,
      currency,
      false,
    );

    return {
      id,
      addr1,
      addr2,
      currency,
      makerSide,
      takerSide,
      makerOdds,
      takerOdds,
      maker: { ...makerCalc, ...makerPayout },
      taker: { ...takerCalc, ...takerPayout },
      betIsPrivate,
      whitelistedAddress,
      betIsCancelled,
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
        setTimeout(() => {
          router.push(`/my-bets`);
        }, 1000);
      },
    });
  };

  if (isLoading || !betDetails) {
    return <div>Loading...</div>;
  }

  const canTakeBet = address?.address !== betDetails.addr1 && address?.address !== betDetails.addr2;
  const currentSide = showMaker ? betDetails.maker : betDetails.taker;

  return (
    <motion.div 
      className="pb-32 pt-6 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto mt-6 mb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-white">Match Bet</h1>
        <Link href={`/take-bet/${id}`} className="flex items-center gap-1 text-lg text-white">
          <BsChevronLeft className="text-lg text-white" />
          <span className="text-lg text-white">Back</span>
        </Link>
      </div>
      <hr className="border-1 mb-6 border-[#5C6BC0]" />

      <motion.div 
        className="mt-4 cursor-pointer"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">The bet</h3>
          <div className="flex gap-1 text-sm">
            <button
              className={`rounded-full px-4 py-1 ${!showMaker ? "bg-[#D32F2F] text-white" : "bg-[#3949AB] text-white"}`}
              onClick={() => setShowMaker(false)}
            >
              Taker {betDetails.addr2 === address?.address || betDetails.whitelistedAddress === address?.address || betDetails.addr2 === "0x0000000000000000000000000000000000000000" ? "(You)" : ""}
            </button>
            <button
              className={`rounded-full px-4 py-1 ${showMaker ? "bg-[#D32F2F] text-white" : "bg-[#3949AB] text-white"}`}
              onClick={() => setShowMaker(true)}
            >
              Maker {betDetails.addr1 === address?.address ? "(You)" : ""}
            </button>
          </div>
        </div>
        <MatchBetCard
          side={showMaker ? betDetails.makerSide : betDetails.takerSide}
          addr1={betDetails.addr1}
          addr2={betDetails.addr2}
          oddsSide1={data?.[10]}
          oddsSide2={data?.[11]}
        />
      </motion.div>

      <motion.div 
        className="mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-white">{showMaker ? "Bet maker" : "Bet taker"}</h2>
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
      </motion.div>

      <motion.div 
        className="mt-6 flex w-full gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Wager</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.betAmount.toFixed(4)}
          </p>
          <p className="text-sm text-gray-300">${betDetails.currency}</p>
        </div>
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
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
      </motion.div>

      <motion.div 
        className="mt-6 flex w-full gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">To win</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.amountToWin.toFixed(4)} ${betDetails.currency}
          </p>
        </div>
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Total payout</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.totalPayout.toFixed(4)} ${betDetails.currency}
          </p>
          <p className="text-sm text-gray-300">(Bet amount + To win)</p>
        </div>
      </motion.div>

      <motion.div 
        className="mt-6 flex w-full gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Based.bet fee</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.fee.toFixed(4)} ${betDetails.currency}
          </p>
          <p className="text-sm text-gray-300">({(currentSide.feePercentage * 100).toFixed(2)}%)</p>
        </div>
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Paid if Won</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.totalPayoutAfterFees.toFixed(4)} ${betDetails.currency}
          </p>
          <p className="text-sm text-gray-300">(From contract)</p>
        </div>
      </motion.div>

      <motion.div 
        className="mt-6 flex w-full gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">If Draw</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {currentSide.drawReturn.toFixed(4)} ${betDetails.currency}
          </p>
          <p className="text-sm text-gray-300">({(currentSide.feePercentage * 100).toFixed(2)}% fee)</p>
        </div>
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">If Lose</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">0 ${betDetails.currency}</p>
        </div>
      </motion.div>

      {canTakeBet && !showMaker && (
        <motion.div
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="w-full rounded-full bg-[#D32F2F] px-6 py-3 text-white font-bold text-lg text-center transition-all duration-300 hover:bg-[#B71C1C] hover:shadow-lg"
            onClick={handleTakeBet}
            disabled={isPending && !isIdle}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {isPending ? (
              <>
                <CgSpinnerAlt className="mr-2 inline-block animate-spin" />
                Matching bet...
              </>
            ) : (
              "Take bet"
            )}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MatchBet;