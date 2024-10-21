"use client";
import React, { useState } from "react";
import mike from "~/assets/fighters/kamala.jpeg";
import logan from "~/assets/fighters/trump.jpeg";
import Link from "next/link";
import { contract } from "~/contract";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { useParams } from "next/navigation";
import { BsChevronLeft } from "react-icons/bs";
import TakeBetCard from "~/app/_components/bets/TakeBetCard";
import Image from "next/image";
import pfp from "~/assets/pfp/pfp.png";
import { motion } from "framer-motion";

const Bet = () => {
  const params = useParams();
  const address = useActiveAccount();
  const id = Number(params.id);
  const { data, isLoading } = useReadContract({
    contract,
    method:
      "function bets(uint256) view returns (uint256 id, address addr1, address addr2, uint256 amount, bool matched, uint8 winner, bool withdrawn, uint8 side, string currency, uint256 createdAt, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr, bool cancelled)",
    params: [BigInt(id)],
  });

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };


  console.log("DATA: ", data);
  console.log("ID: ", data?.[0]);
  console.log("ADDR1: ", data?.[1]);
  console.log("ADDR2: ", data?.[2]);
  console.log("AMOUNT: ", data?.[3]);
  console.log("MATCHED: ", data?.[4]);
  console.log("WINNER: ", data?.[5]);
  console.log("WITHDRAWN: ", data?.[6]);
  console.log("SIDE: ", data?.[7]);
  console.log("CURRENCY: ", data?.[8]);
  console.log("CREATED AT: ", data?.[9]);
  console.log("ODDS SIDE 1: ", data?.[10]);
  console.log("ODDS SIDE 2: ", data?.[11]);

  let amountToWin;
  const amount = Number(data?.[3]) / 10 ** 18;
  const odds = data?.[7] === 1 ? Number(data?.[10]) : Number(data?.[11]);
  const oddsTaker = data?.[7] === 1 ? Number(data?.[11]) : Number(data?.[10]);

  if (odds > 0) {
    // Positive odds: user gets odds for every 100 bet
    amountToWin = (amount * odds) / 100;
  } else {
    // Negative odds: user wins 100 for each |odds| bet
    amountToWin = (amount * 100) / Math.abs(odds);
  }

  let takerWagerAmount;
  if (oddsTaker > 0) {
    takerWagerAmount = (amount * 100) / oddsTaker;
  } else {
    takerWagerAmount = (amount * Math.abs(oddsTaker)) / 100;
  }

  return (
    <motion.div 
      className="pb-32 pt-6 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto mt-6 mb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-6">
        <Link
          href="/pick-bet"
          className="flex items-center gap-1 text-lg text-white"
        >
          <BsChevronLeft className="text-lg text-white" />
          <span className="text-lg text-white">Back</span>
        </Link>
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-6">Take Bet</h1>
      <hr className="border-1 mb-6 border-[#5C6BC0]" />
      
      <Link href={`/match-bet/${id}`}>
        <motion.div 
          className="mt-4 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <TakeBetCard
            image={data?.[7] === 1 ? mike : logan}
            side1="Kamala Harris"
            side2="Donald Trump"
            result={data?.[5] === 1 ? "Win" : "Lose"}
          />
        </motion.div>
      </Link>
      <motion.div 
        className="mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-white">Bet maker</h2>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={pfp}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="text-white">
              <p className="font-bold">{shortenAddress(data?.[1] ?? "")}</p>
              <p className="text-sm text-gray-300">{data?.[7] === 1 ? "Kamala Harris" : "Donald Trump"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="mt-6 flex w-full gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Wager</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
            {amount.toFixed(4)}
          </p>
          <p className="text-sm text-gray-300">${data?.[8]}</p>
        </div>
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Odds</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">{odds > 0 ? `+${odds}` : odds}</p>
          <p className="text-sm text-gray-300">
            {data?.[7] === 1 ? "Kamala Harris" : "Donald Trump"}
          </p>
        </div>
      </motion.div>

      <motion.div 
        className="mt-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-semibold text-white">Bet taker (me)</h2>
        <hr className="border-1 my-3 border-[#D32F2F]" />
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={pfp}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="text-white">
              <p className="font-bold">Me</p>
              <p className="text-sm text-gray-300">{data?.[7] === 1 ? "Donald Trump" : "Kamala Harris"}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="mt-6 flex w-full gap-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Wager</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">
          {takerWagerAmount.toFixed(4)}
          </p>
          <p className="text-sm text-gray-300">${data?.[8]}</p>
        </div>
        <div className="w-full bg-[#3F51B5]/30 p-4 rounded-lg">
          <h3 className="text-xl font-semibold text-white">Odds</h3>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <p className="text-lg font-semibold text-white">{oddsTaker > 0 ? `+${oddsTaker}` : oddsTaker}</p>
          <p className="text-sm text-gray-300">
            {data?.[7] === 1 ? "Donald Trump" : "Kamala Harris"}
          </p>
        </div>
      </motion.div>

      {
      data?.[1] !== "0x0000000000000000000000000000000000000000" &&
      data?.[2] === "0x0000000000000000000000000000000000000000" && data?.[1] !== address?.address ? (
        <motion.div
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href={`/match-bet/${id}`}>
            <motion.button
              className="w-full rounded-full bg-[#D32F2F] px-6 py-3 text-white font-bold text-lg text-center transition-all duration-300 hover:bg-[#B71C1C] hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Match Bet
            </motion.button>
          </Link>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default Bet;