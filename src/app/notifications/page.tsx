"use client";
import React from "react";
import pfp from "~/assets/notifications/pfp.png";
import SingleNotification from "../_components/notifications/SingleNotification";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { contract } from "~/contract";
import Link from "next/link";
import { motion } from 'framer-motion';

const Notifications = () => {
  const address = useActiveAccount();
  const userAddress = address?.address;

  const { data: privateBets, isLoading: privateBetsLoading } = useReadContract({
    contract,
    method:
      "function getPrivateBets(address user) view returns ((uint256 id, address addr1, address addr2, uint256 amount, bool matched, uint8 winner, bool withdrawn, uint8 side, string currency, uint256 createdAt, int256 oddsSide1, int256 oddsSide2, bool isPrivate, address whitelistedAddr, bool cancelled)[])",
    params: [userAddress!],
  });

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const availableBets = privateBets?.filter((bet) => bet.matched === false);

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
      className="pb-24 mb-6 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h1 className="text-3xl font-extrabold text-white mb-6">Notifications</h1>
      <hr className="border-1 mb-6 border-[#5C6BC0]" />
      <motion.div className="grid grid-cols-1 gap-4" variants={itemVariants}>
        {availableBets && availableBets?.length > 0 ? privateBets
          ?.filter((bet) => bet.isPrivate === true)
          .sort((a, b) => Number(b.amount) - Number(a.amount))
          .map((bet, i) => {
            if (
              (bet.addr1 !== "0x0000000000000000000000000000000000000000" ||
                bet.addr2 !== "0x0000000000000000000000000000000000000000") &&
              bet.addr1 !== userAddress &&
              bet.addr2 !== userAddress
            ) {
              return (
                <Link href={`/take-bet/${bet.id}`} key={i}>
                  <SingleNotification
                    image={pfp}
                    title={`Bet from ${shortenAddress(bet.addr1)}`}
                    action="View bet"
                  />
                </Link>
              );
            }
          }) : 
           <p className="text-white text-center">No new notifications</p>
          }
      </motion.div>
    </motion.div>
  );
};

export default Notifications;
