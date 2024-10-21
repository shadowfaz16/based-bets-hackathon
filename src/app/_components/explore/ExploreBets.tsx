"use client";
import React, { useState } from "react";
import logan from "~/assets/fighters/trump.jpeg";
import ExploreBetCard from "../bets/ExploreBetCard";
import { AnimatePresence, motion } from "framer-motion";
import CreateBetModal from "../modals/CreateBetModal";
import PickBetPage from "../../pick-bet/page";

type Sport = {
  name: string;
  side1?: string;
  side2?: string;
  content: React.ReactNode;
};

const ExploreBets = () => {
  const [openSports, setOpenSports] = useState<string[]>(["UFC"]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleSport = (sport: string) => {
    setOpenSports((prev) =>
      prev.includes(sport) ? prev.filter((s) => s !== sport) : [...prev, sport],
    );
  };

  const sports = [
    {
      name: "Elections",
      content: <ExploreBetCard image={logan} side1="Kamala Harris" side2="Donald Trump" result="Loss" />,
      side1: "Kamala Harris",
      side2: "Donald Trump",
    },
    {
      name: "UFC",
      content: <p className="text-lg text-white">Coming soon</p>,
    },
    {
      name: "E-Sports",
      content: <p className="text-lg text-white">Coming soon</p>,
    },
    {
      name: "MMA",
      content: <p className="text-lg text-white">Coming soon</p>,
    },
    {
      name: "Soccer",
      content: <p className="text-lg text-white">Coming soon</p>,
    },
    {
      name: "Hockey",
      content: <p className="text-lg text-white">Coming soon</p>,
    },
    {
      name: "Basketball",
      content: <p className="text-lg text-white">Coming soon</p>,
    },
    {
      name: "Baseball",
      content: <p className="text-lg text-white">Coming soon</p>,
    },
    {
      name: "Football",
      content: <p className="text-lg text-white">Coming soon</p>,
    },
    {
      name: "Rugby",
      content: <p className="text-lg text-white">Coming soon</p>,
    },
  ];

  const filteredSports = sports.filter(
    (sport: Sport) =>
      sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ??
      (sport.side1?.toLowerCase().includes(searchQuery.toLowerCase())) ??
      (sport.side2?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="pb-24 flex flex-col items-center">
      {/* Commented out search bar
      <div className="mb-6 flex items-center justify-between rounded-full border border-[#D32F2F] bg-black/40 px-4 py-2 shadow-[0_0_10px_rgba(242,139,130,0.3)]">
        <input
          type="text"
          placeholder="Search for bets"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-[#D32F2F] outline-none"
        />
        <BsSearch className="text-2xl text-white" />
      </div>
      */}
      
      {/* Main Bet Section */}
      <motion.div 
        className="mb-8 rounded-xl shadow-lg w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-2xl font-bold text-white">Featured Bet</h2>
        <ExploreBetCard 
          image={logan} 
          side1="Harris" 
          side2="Trump" 
          result="Loss" 
          onOpenModal={() => setIsModalOpen(true)}
        />
      </motion.div>

      {/* Other Categories */}
      <div className="grid grid-cols-2 gap-4">
        {filteredSports.slice(1).map((sport) => (
          <motion.div 
            key={sport.name} 
            className="rounded-lg bg-black/40 p-4 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="mb-2 text-lg font-semibold text-white">{sport.name}</h3>
            <p className="text-sm text-[#D32F2F]">Coming Soon</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsModalOpen(false)}
            />
            <div 
              className="relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <CreateBetModal onClose={() => setIsModalOpen(false)}>
                <PickBetPage />
              </CreateBetModal>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreBets;
