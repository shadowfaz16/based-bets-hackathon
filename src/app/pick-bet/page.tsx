"use client";
import React from "react";
import { BsChevronLeft, BsPlus } from "react-icons/bs";
import PickBetCard from "../_components/bets/PickBetCard";
import mike from "~/assets/fighters/kamala.jpeg";
import Link from "next/link";
import useCreateBetStore from "~/store/create-bet";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "~/contract";
import pfp from "~/assets/pfp/pfp.png";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
// TODO: pull bet data from smart contract
// TODO: get open and private bets from smart contract
// TODO: toggle between open and private bets

const PickBet = () => {
  const { setCurrentStep } = useCreateBetStore();
  const userAddress = useActiveAccount()?.address;

  const [showPrivate, setShowPrivate] = useState(false);

  console.log("userAddress: ", userAddress);

  const handleCreateBetClick = () => {
    setCurrentStep(2);
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const { data: openBets, isLoading: openBetsLoading } = useReadContract({
    contract,
    method:
      "function getOpenBets() view returns ((uint256 id, address addr1, address addr2, uint256 amount, bool matched, uint8 winner, bool withdrawn, uint8 side, string currency, uint256 createdAt, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr, bool cancelled)[])",
    params: [],
  });

  console.log("openBets: ", openBets);

  const { data: privateBets, isLoading: privateBetsLoading } = useReadContract({
    contract,
    method:
      "function getPrivateBets(address user) view returns ((uint256 id, address addr1, address addr2, uint256 amount, bool matched, uint8 winner, bool withdrawn, uint8 side, string currency, uint256 createdAt, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr, bool cancelled)[])",
    params: [userAddress!],
  });

  return (
    <div className="pb-24">
      <Link href="/explore" className="flex items-center gap-1 text-lg text-white mb-4">
        <BsChevronLeft className="text-lg text-white" />
        <span className="text-lg text-white">Back</span>
      </Link>
      <PickBetCard image={mike} name="Kamala Harris" result="1X" />
      <div className="mt-8">
        <button
          className="flex w-full items-center justify-center gap-1 rounded-full bg-[#D32F2F] py-3 px-6 transition-all duration-300 hover:bg-[#B71C1C] hover:shadow-lg"
          onClick={handleCreateBetClick}
        >
          <BsPlus className="text-white text-2xl" />
          <span className="text-xl font-bold text-white">Create bet</span>
        </button>
      </div>
      <div className="mt-8">
        <div className="flex items-center rounded-full overflow-hidden bg-black/20">
          <motion.div
            className="relative flex h-10 w-full items-center justify-center"
            onClick={() => setShowPrivate(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-[#D32F2F]"
              initial={false}
              animate={{ opacity: showPrivate ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <p className="relative z-10 font-semibold text-white">Public bets</p>
          </motion.div>
          <motion.div
            className="relative flex h-10 w-full items-center justify-center"
            onClick={() => setShowPrivate(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-[#D32F2F]"
              initial={false}
              animate={{ opacity: showPrivate ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <p className="relative z-10 font-semibold text-white">Private offers</p>
          </motion.div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-lg font-semibold text-white">Kamala Harris</p>
          <p className="text-lg font-semibold text-white">Donald Trump</p>
        </div>
        <div className="mt-8 flex flex-col space-y-8 text-white">
          {!showPrivate &&
            openBets
              ?.filter((bet) => bet.isPrivate === false)
              .sort((a, b) => Number(b.amount) - Number(a.amount))
              .map((bet, i) => {
                if (
                  (bet.addr1 !== "0x0000000000000000000000000000000000000000" ||
                    bet.addr2 !==
                      "0x0000000000000000000000000000000000000000") &&
                  bet.addr1 !== userAddress &&
                  bet.addr2 !== userAddress
                ) {
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Link
                        href={`/take-bet/${bet.id}`}
                        className="flex flex-col items-center justify-center"
                      >
                        <div className="flex w-full items-center rounded-t-xl bg-black/40 p-2">
                          {bet.side === 1 ? (
                            <div className="flex flex-col items-center justify-center gap-1">
                              <Image src={pfp} alt="pfp" width={80} height={80} />
                              {bet.side === 1
                                ? Number(bet.oddsSide1) > 0
                                  ? `+${Number(bet.oddsSide1)}`
                                  : Number(bet.oddsSide1)
                                : Number(bet.oddsSide2) > 0
                                  ? `+${Number(bet.oddsSide2)}`
                                  : Number(bet.oddsSide2)}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-1">
                              <p className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D32F2F] text-center"></p>
                              {bet.side === 1
                                ? Number(bet.oddsSide1) > 0
                                  ? `+${Number(bet.oddsSide1)}`
                                  : Number(bet.oddsSide1)
                                : Number(bet.oddsSide2) > 0
                                  ? `+${Number(bet.oddsSide2)}`
                                  : Number(bet.oddsSide2)}
                            </div>
                          )}
                          <div className="flex w-full flex-col items-center justify-center">
                            <p className="text-sm text-[#D32F2F]">Bet amount: </p>
                            <p>
                              {bet.amount ? Number(bet.amount) / 10 ** 18 : "N/A"}{" "}
                              {bet.currency}
                            </p>
                          </div>
                          {bet.side === 1 ? (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <p className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D32F2F] text-center "></p>
                              {bet.side === 1
                                ? Number(bet.oddsSide2) > 0
                                  ? `+${Number(bet.oddsSide2)}`
                                  : Number(bet.oddsSide2)
                                : Number(bet.oddsSide1) > 0
                                  ? `+${Number(bet.oddsSide1)}`
                                  : Number(bet.oddsSide1)}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Image src={pfp} alt="pfp" width={80} height={80} />
                              {bet.side === 1
                                ? Number(bet.oddsSide2) > 0
                                  ? `+${Number(bet.oddsSide2)}`
                                  : Number(bet.oddsSide2)
                                : Number(bet.oddsSide1) > 0
                                  ? `+${Number(bet.oddsSide1)}`
                                  : Number(bet.oddsSide1)}
                            </div>
                          )}
                        </div>
                        <div 
                          className="flex h-7 w-full items-center justify-center rounded-b-xl bg-[#D32F2F] cursor-pointer"
                        >
                          <p className="text-xs font-semibold uppercase text-white">
                            Take bet
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                }
              })}
          {showPrivate &&
            privateBets
              ?.filter((bet) => bet.isPrivate === true)
              .sort((a, b) => Number(b.amount) - Number(a.amount))
              .map((bet, i) => {
                if (
                  (bet.addr1 !== "0x0000000000000000000000000000000000000000" ||
                    bet.addr2 !==
                      "0x0000000000000000000000000000000000000000") &&
                  bet.addr1 !== userAddress &&
                  bet.addr2 !== userAddress
                ) {
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Link
                        href={`/take-bet/${bet.id}`}
                        className="flex flex-col items-center justify-center"
                      >
                        <div className="flex w-full items-center rounded-t-xl bg-black/40 p-2">
                          {bet.side === 1 ? (
                            <div className="flex flex-col items-center justify-center gap-1">
                              <Image src={pfp} alt="pfp" width={80} height={80} />
                              {bet.side === 1
                                ? Number(bet.oddsSide1) > 0
                                  ? `+${Number(bet.oddsSide1)}`
                                  : Number(bet.oddsSide1)
                                : Number(bet.oddsSide2) > 0
                                  ? `+${Number(bet.oddsSide2)}`
                                  : Number(bet.oddsSide2)}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-1">
                              <p className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D32F2F] text-center"></p>
                              {bet.side === 1
                                ? Number(bet.oddsSide1) > 0
                                  ? `+${Number(bet.oddsSide1)}`
                                  : Number(bet.oddsSide1)
                                : Number(bet.oddsSide2) > 0
                                  ? `+${Number(bet.oddsSide2)}`
                                  : Number(bet.oddsSide2)}
                            </div>
                          )}
                          <div className="flex w-full flex-col items-center justify-center">
                            <p className="text-sm text-[#D32F2F]">Bet amount: </p>
                            <p>
                              {bet.amount ? Number(bet.amount) / 10 ** 18 : "N/A"}{" "}
                              {bet.currency}
                            </p>
                          </div>
                          {bet.side === 1 ? (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <p className="flex h-14 w-14 items-center justify-center rounded-full bg-[#D32F2F] text-center "></p>
                              {bet.side === 1
                                ? Number(bet.oddsSide2) > 0
                                  ? `+${Number(bet.oddsSide2)}`
                                  : Number(bet.oddsSide2)
                                : Number(bet.oddsSide1) > 0
                                  ? `+${Number(bet.oddsSide1)}`
                                  : Number(bet.oddsSide1)}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Image src={pfp} alt="pfp" width={80} height={80} />
                              {bet.side === 1
                                ? Number(bet.oddsSide2) > 0
                                  ? `+${Number(bet.oddsSide2)}`
                                  : Number(bet.oddsSide2)
                                : Number(bet.oddsSide1) > 0
                                  ? `+${Number(bet.oddsSide1)}`
                                  : Number(bet.oddsSide1)}
                            </div>
                          )}
                        </div>
                        <div 
                          className="flex h-7 w-full items-center justify-center rounded-b-xl bg-[#D32F2F] cursor-pointer"
                        >
                          <p className="text-xs font-semibold uppercase text-white">
                            Take bet
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                }
              })}
        </div>
      </div>
    </div>
  );
};

export default PickBet;
