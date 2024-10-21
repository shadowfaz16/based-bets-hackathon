"use client";
import React from "react";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import useCreateBetStore from "~/store/create-bet";
import { prepareContractCall } from "thirdweb";
import { contract } from "../../../contract";
import { toast } from "sonner";
import BetCard from "../bets/BetCard";
import { CgSpinnerAlt } from "react-icons/cg";

const CreateBetStep5 = () => {
  const {
    amount,
    currency,
    oddsSide1,
    oddsSide2,
    side,
    betIsPrivate,
    whitelistAddress,
    setCurrentStep,
  } = useCreateBetStore();

  const account = useActiveAccount();

  const handleNext = () => {
    setCurrentStep(6);
  };

  let amountToWin;
  const betAmount = amount * 10 ** 18;
  const odds = side === 1 ? Number(oddsSide1) : Number(oddsSide2);

  if (odds > 0) {
    // Positive odds: user gets odds for every 100 bet
    amountToWin = (amount * odds) / 100;
  } else {
    // Negative odds: user wins 100 for each |odds| bet
    amountToWin = (amount * 100) / Math.abs(odds);
  }

  const totalPayout = amount + amountToWin;
  const fee = totalPayout * 0.05;
  const totalPayoutAfterFees = totalPayout - fee;

  const {
    mutate: sendTransaction,
    isSuccess,
    data,
    isPending,
    isError,
    isIdle,
  } = useSendTransaction();

  console.log("isSuccess: ", isSuccess);
  console.log("data: ", data);

  const onClick = async () => {
    // console.log("SSS: ", amount, currency, side, oddsSide1, oddsSide2);
    console.log("Interacting with contract", contract);
    console.log ("Currency is ", currency.toUpperCase());
    const currencyFinal = currency.toUpperCase();
    // Check if balance is sufficient
    // const balance = await getWalletBalance(currencyFinal);
    // console.log("Balance: ", balance);  
    const transaction = prepareContractCall({
      contract,
      method:
        "function createBet(uint256 amount, string currency, uint8 side, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr) payable",
      params: [
        BigInt(betAmount),
        currency,
        side!,
        BigInt(oddsSide1),
        BigInt(oddsSide2),
        betIsPrivate,
        whitelistAddress as `0x${string}`,
      ],
      value: BigInt(betAmount),
    });
    console.log("Txn Sending: ", transaction);

    if (!account) {
      toast.error("Please connect your wallet");
      return;
    }

    sendTransaction(transaction, {
      onError: (error) => {
        toast.error("Error placing bet");
        console.log("Error: ", error);
      },
      onSuccess: () => {
        toast.success("Bet placed successfully");
        // wait 1 second
        setTimeout(() => {
          handleNext();
        }, 1000);
      },
    });
  };

  return (
    <div className="pb-24">
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white">Approve the bet</h3>
        <hr className="border-1 my-4 border-[#D32F2F]" />
      </div>
      <div className="mt-4">
        <BetCard side={side} />
      </div>
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white">The bet</h3>
        <hr className="border-1 my-4 border-[#D32F2F]" />
      </div>
      <div className="mt-6 bg-[#0a0826] rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white">
          Bet amount & currency
        </h3>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <p className="text-2xl font-semibold text-[#D32F2F]">
          {amount} {currency}
        </p>
      </div>
      <div className="mt-6 bg-[#0a0826] rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white">Odds</h3>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <p className="text-2xl font-semibold text-[#D32F2F]">
          {side === 1
            ? `${Number(oddsSide1) > 0 ? "+" : ""}${Number(oddsSide1)}`
            : `${Number(oddsSide2) > 0 ? "+" : ""}${Number(oddsSide2)}`}
        </p>
      </div>
      <div className="mt-6 bg-[#0a0826] rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white">To win</h3>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <p className="text-2xl font-semibold text-[#D32F2F]">
          {amountToWin.toFixed(4)} {currency}
        </p>
      </div>
      <div className="mt-6 bg-[#0a0826] rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white">
          Total payout (Bet amount + To win)
        </h3>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <p className="text-2xl font-semibold text-[#D32F2F]">
          {totalPayout.toFixed(4)} {currency}
        </p>
      </div>
      <div className="mt-6 bg-[#0a0826] rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white">
          Based.bet fee {currency === "BBX" ? "(5%)" : "(8%)"}
        </h3>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <p className="text-2xl font-semibold text-[#D32F2F]">
          {fee.toFixed(5)} {currency}
        </p>
      </div>
      <div className="mt-6 bg-[#0a0826] rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white">
          Paid from contract if Won
        </h3>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <p className="text-2xl font-semibold text-[#D32F2F]">
          {totalPayoutAfterFees.toFixed(4)} {currency}
        </p>
      </div>
      <div className="mt-6 bg-[#0a0826] rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white">
          Amount returned if Draw
          <span className="ml-2 text-sm">(-8%)</span>
        </h3>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <p className="text-2xl font-semibold text-[#D32F2F]">
          {(amount * 0.92).toFixed(5)} {currency}
        </p>
      </div>
      <div className="mt-6 bg-[#0a0826] rounded-xl p-4">
        <h3 className="text-lg font-semibold text-white">
          Amount returned if Lose
        </h3>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <p className="text-2xl font-semibold text-[#D32F2F]">0 {currency}</p>
      </div>
      <div className="mt-6">
        <button
          className="w-full rounded-full bg-[#D32F2F] px-6 py-3 text-white font-bold text-lg transition-all duration-300 hover:bg-[#B71C1C] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onClick}
          disabled={isPending && !isIdle}
        >
          {!isError && isPending ? (
            <>
              <CgSpinnerAlt className="mr-2 animate-spin text-2xl inline" />
              Placing bet...
            </>
          ) : (
            "Place bet"
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateBetStep5;