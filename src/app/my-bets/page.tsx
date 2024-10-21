"use client";
import React, { useState } from "react";
import MyBetCard from "../_components/bets/MyBetCard";
import { contract } from "../../contract";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { motion } from 'framer-motion';

const MyBets = () => {
  const [showPrivate, setShowPrivate] = useState(false);
  const address = useActiveAccount()?.address;

  const { data: userdata, isLoading: userisLoading } = useReadContract({
    contract,
    method:
      "function getUserBets(address user) view returns ((uint256 id, address addr1, address addr2, uint256 amount, bool matched, uint8 winner, bool withdrawn, uint8 side, string currency, uint256 createdAt, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr, bool cancelled)[])",
    params: [address!],
  });

  console.log("USER BETS: ", userdata);

  const { data: privateBets } = useReadContract({
    contract,
    method:
      "function getPrivateBets(address user) view returns ((uint256 id, address addr1, address addr2, uint256 amount, bool matched, uint8 winner, bool withdrawn, uint8 side, string currency, uint256 createdAt, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr, bool cancelled)[])",
    params: [address!],
  });

  console.log("PRIVATE BETS: ", privateBets);

  const filteredBets = userdata?.filter((bet) => bet.isPrivate === showPrivate);
  const offeredBets = filteredBets?.filter(
    (bet) => !bet.matched && bet.addr1 === address,
  );
  const acceptedBets = filteredBets?.filter(
    (bet) => bet.matched && !bet.withdrawn && bet.winner === 0,
  );
  const settledBets = filteredBets?.filter((bet) => bet.winner !== 0);
  const sentToMe = filteredBets?.filter(
    (bet) => bet.whitelistedAddr === address,
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="pb-32 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[calc(100vh-80px)] overflow-y-auto mb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-white">My Bets</h1>
        <div className="flex gap-1 text-sm">
          <button
            className={`rounded-full px-4 py-2 ${!showPrivate ? "bg-[#D50000] text-white" : "bg-[#3949AB] text-white"}`}
            onClick={() => setShowPrivate(false)}
          >
            Public
          </button>
          <button
            className={`rounded-full px-4 py-2 ${showPrivate ? "bg-[#D50000] text-white" : "bg-[#3949AB] text-white"}`}
            onClick={() => setShowPrivate(true)}
          >
            Private
          </button>
        </div>
      </div>
      <hr className="border-1 mb-6 border-[#5C6BC0]" />
      
      {!address ? (
        <motion.p className="mt-4 text-white text-center" variants={itemVariants}>
          Please connect your wallet to view your bets.
        </motion.p>
      ) : userdata?.length === 0 && privateBets?.length === 0 ? (
        <motion.p className="mt-4 text-white text-center" variants={itemVariants}>You have no bets.</motion.p>
      ) : (
        <>
          <motion.div className="mt-6" variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-white mb-4">Offered Bets</h2>
            <div className="grid grid-cols-1 gap-4">
              {offeredBets?.length === 0 ? (
                <p className="text-white/80">You have no offered bets yet.</p>
              ) : (
                offeredBets?.map((bet, index) => (
                  <MyBetCard key={index} {...bet} />
                ))
              )}
            </div>
          </motion.div>
          <motion.div className="mt-6" variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-white mb-4">Accepted Bets</h2>
            <div className="grid grid-cols-1 gap-4">
              {acceptedBets?.length === 0 ? (
                <p className="text-white/80">
                  You have no accepted bets yet.
                </p>
              ) : (
                acceptedBets?.map((bet, index) => (
                  <MyBetCard key={index} {...bet} />
                ))
              )}
            </div>
          </motion.div>
          <motion.div className="mt-8" variants={itemVariants}>
            <h2 className="text-2xl font-semibold text-white mb-4">Settled Bets</h2>
            <div className="grid grid-cols-1 gap-4">
              {settledBets?.length === 0 ? (
                <p className="text-white/80">You have no settled bets yet.</p>
              ) : (
                settledBets?.map((bet, index) => (
                  <MyBetCard key={index} {...bet} />
                ))
              )}
            </div>
          </motion.div>
          {showPrivate && privateBets ? (
            <motion.div className="mt-6" variants={itemVariants}>
              <h2 className="text-2xl font-semibold text-white mb-4">Sent to me</h2>
              <div className="mt-4 grid grid-cols-1 gap-6">
                {privateBets
                  ?.filter((bet) => bet.addr2 !== address)
                  .map((bet, index) => <MyBetCard key={index} {...bet} />)}
              </div>
            </motion.div>
          ) : null}
        </>
      )}
    </motion.div>
  );
};

export default MyBets;
