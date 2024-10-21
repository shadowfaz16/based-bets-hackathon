"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { contract } from "~/contract";
import {
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";
import { useParams } from "next/navigation";
import { prepareContractCall } from "thirdweb";
import { BsChevronLeft } from "react-icons/bs";
import MatchBetCard from "~/app/_components/bets/MatchBetCard";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import CancelBet from "~/app/_components/modals/CancelBet";
import { CgSpinnerAlt } from "react-icons/cg";

const Bet = () => {
  const params = useParams();
  const address = useActiveAccount();
  const id = Number(params.id);
  const [showMaker, setShowMaker] = useState(true);
  const [cancelBet, setCancelBet] = useState(false);

  const { data, isLoading } = useReadContract({
    contract,
    method:
      "function bets(uint256) view returns (uint256 id, address addr1, address addr2, uint256 amount, bool matched, uint8 winner, bool withdrawn, uint8 side, string currency, uint256 createdAt, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr, bool cancelled)",
    params: [BigInt(id)],
  });

  console.log("DATA: ", data);

  const { data: newData } = useReadContract({
    contract,
    method:
      "function getBet(uint256 betId) view returns ((uint256 id, address addr1, address addr2, uint256 amount, bool matched, uint8 winner, bool withdrawn, uint8 side, string currency, uint256 createdAt, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr, bool cancelled))",
    params: [BigInt(id)],
  });

  console.log("NEW DATA: ", newData);

  const {
    mutate: claimWinnings,
    status,
    isPending: isClaimingWinnings,
    isIdle: isClaimingWinningsIdle,
  } = useSendTransaction();
  const onClick = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function withdrawWinnings(uint256 betId)",
      params: [BigInt(id)],
    });
    claimWinnings(transaction, {
      onSuccess: () => {
        toast.success("Bet withdrawn successfully");
      },
    });
  };

  useEffect(() => {
    if (status === "success") {
      toast.success("Winnings claimed");
    }
  }, [status]);

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
    const betIsMatched = matched;
    const whitelistedAddress = String(whitelistedAddr);
    const betIsCancelled = Number(cancelled);
    const betWinner = Number(winner);
    const betWithdrawn = withdrawn;

    console.log("WINNER: ", winner);

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

    const canCancelBet = address?.address === addr1 && !betIsMatched;

    // check if address side is winner side
    const isWinner =
      (address?.address === addr1 && betWinner === makerSide) ||
      (address?.address === addr2 && betWinner === takerSide);

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
      canCancelBet,
      betWinner,
      isWinner,
      betWithdrawn,
    };
  }, [data, address?.address]);

  const handleTakeBet = () => {
    if (!betDetails) return;

    const transaction = prepareContractCall({
      contract,
      method: "function matchBet(uint256 betId, uint8 side) payable",
      params: [BigInt(id), betDetails.takerSide],
      value: BigInt(Math.round(betDetails.taker.betAmount * 10 ** 18)),
    });

    console.log("INTT: ", Math.round(betDetails.taker.betAmount * 10 ** 18));

    sendTransaction(transaction, {
      onError: (error) => {
        toast.error(error?.message || "An error occurred");
        console.error("Error: ", error);
      },
      onSuccess: () => {
        toast.success("Bet taken successfully");
      },
    });
  };

  if (isLoading) {
    return (
      <motion.div 
        className="pb-24 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CgSpinnerAlt className="animate-spin text-4xl text-white" />
      </motion.div>
    );
  }

  if (!data || !betDetails) {
    return (
      <motion.div 
        className="pb-24 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-white">Bet Not Found</h1>
          <Link
            href={`/my-bets`}
            className="flex items-center gap-1 text-lg text-white"
          >
            <BsChevronLeft className="text-lg text-white" />
            <span className="text-lg text-white">Back</span>
          </Link>
        </div>
        <hr className="border-1 mb-6 border-[#5C6BC0]" />
        <p className="text-white text-center">This bet doesn&apos;t exist or hasn&apos;t been created yet.</p>
      </motion.div>
    );
  }

  const canTakeBet =
    address?.address !== betDetails.addr1 &&
    address?.address !== betDetails.addr2;
  const currentSide = showMaker ? betDetails.maker : betDetails.taker;

  return (
    <motion.div 
      className="pb-24 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-white">Take bet</h1>
        <Link
          href={`/my-bets`}
          className="flex items-center gap-1 text-lg text-white"
        >
          <BsChevronLeft className="text-lg text-white" />
          <span className="text-lg text-white">Back</span>
        </Link>
      </div>
      <hr className="border-1 mb-6 border-[#5C6BC0]" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <BetInfoSection title="">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">The bet</h3>
            <div className="flex gap-1 text-sm">
              <button
                className={`rounded-full px-4 py-1 ${showMaker ? "bg-[#D32F2F] text-white" : "bg-[#3949AB] text-white"}`}
                onClick={() => setShowMaker(true)}
              >
                Maker {betDetails.addr1 === address?.address ? "(You)" : ""}
              </button>
              <button
                className={`rounded-full px-4 py-1 ${!showMaker ? "bg-[#D32F2F] text-white" : "bg-[#3949AB] text-white"}`}
                onClick={() => setShowMaker(false)}
              >
                Taker{" "}
                {betDetails.addr2 === address?.address ||
                betDetails.whitelistedAddress === address?.address
                  ? "(You)"
                  : ""}
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
        </BetInfoSection>
      </motion.div>

      {/* Wrap each BetInfoSection in a motion.div for animation */}
      {[
        { title: "Bet amount & currency", value: `${currentSide.betAmount.toFixed(5)} $${betDetails.currency}` },
        { title: "Your odds", value: `${showMaker ? (betDetails.makerOdds > 0 ? "+" : "") : betDetails.takerOdds > 0 ? "+" : ""}${showMaker ? betDetails.makerOdds : betDetails.takerOdds}` },
        { title: "To win", value: `${currentSide.amountToWin.toFixed(5)} $${betDetails.currency}` },
        { title: "Total payout (Bet amount + To win)", value: `${currentSide.totalPayout.toFixed(5)} $${betDetails.currency}` },
        { title: `Based.bet fee (${(currentSide.feePercentage * 100).toFixed(2)}%)`, value: `${currentSide.fee.toFixed(5)} $${betDetails.currency}` },
        { title: "Paid from contract if Won", value: `${currentSide.totalPayoutAfterFees.toFixed(4)} $${betDetails.currency}` },
        { title: `Amount returned if Draw (${(currentSide.feePercentage * 100).toFixed(2)}% fee)`, value: `${currentSide.drawReturn.toFixed(4)} $${betDetails.currency}` },
        { title: "Amount returned if Lose", value: `0 $${betDetails.currency}` },
      ].map((section, index) => (
        <motion.div
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * (index + 1) }}
        >
          <BetInfoSection title={section.title} value={section.value} />
        </motion.div>
      ))}

      {/* Action buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {canTakeBet && !showMaker && (
          <button
            className="mt-6 flex w-full items-center justify-center rounded-full bg-[#D32F2F] px-4 py-2 text-white disabled:opacity-50"
            onClick={handleTakeBet}
            disabled={isPending && !isIdle}
          >
            {isPending ? (
              <>
                <CgSpinnerAlt className="mr-2 animate-spin" />
                Matching...
              </>
            ) : (
              "Take bet"
            )}
          </button>
        )}

        {betDetails.isWinner && !betDetails.betWithdrawn && (
          <button
            className="mt-6 flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-white disabled:opacity-50"
            onClick={onClick}
            disabled={isClaimingWinnings && !isClaimingWinningsIdle}
          >
            {isClaimingWinnings ? (
              <>
                <CgSpinnerAlt className="mr-2 animate-spin" />
                Claiming...
              </>
            ) : (
              "Claim winnings"
            )}
          </button>
        )}

        {betDetails.canCancelBet && (
          <button
            className="mt-6 w-full rounded-full bg-[#E49700] px-4 py-2 text-black"
            onClick={() => setCancelBet(true)}
          >
            Cancel bet
          </button>
        )}
      </motion.div>

      {/* Cancel bet modal */}
      <AnimatePresence>
        {cancelBet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex w-full items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[500px] rounded-lg bg-[#020222] p-4"
            >
              <CancelBet onClose={() => setCancelBet(false)} id={id} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const BetInfoSection = ({
  title,
  value,
  children,
}: {
  title: string;
  value?: string;
  children?: React.ReactNode;
}) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <hr className="border-1 my-3 border-[#D32F2F]" />
    {value ? (
      <p className="text-2xl font-semibold text-[#D32F2F]">{value}</p>
    ) : (
      children
    )}
  </div>
);

export default Bet;
