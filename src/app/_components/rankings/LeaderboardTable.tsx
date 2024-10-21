import React from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaMedal } from 'react-icons/fa';

interface LeaderboardItem {
  rank: number;
  name: string;
  bets: number;
  win: string;
  bbxWon: string;
  pts: number;
}

const LeaderboardTable = () => {
  const data: LeaderboardItem[] = [
    { rank: 1, name: 'Thanas', bets: 325, win: '45%', bbxWon: '48.5k', pts: 124 },
    { rank: 2, name: 'Alex', bets: 200, win: '42%', bbxWon: '35.2k', pts: 98 },
    { rank: 3, name: 'Emma', bets: 179, win: '39%', bbxWon: '29.7k', pts: 87 },
    { rank: 4, name: 'Michael', bets: 160, win: '37%', bbxWon: '25.1k', pts: 76 },
    { rank: 5, name: 'Sophia', bets: 80, win: '35%', bbxWon: '18.3k', pts: 65 }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaCrown className="text-yellow-400 text-2xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-2xl" />;
      case 3:
        return <FaMedal className="text-amber-600 text-2xl" />;
      default:
        return <span className="text-2xl font-bold">{rank}</span>;
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br mb-5 from-[#1A237E] to-[#3949AB] rounded-xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto mt-6 mb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-white mb-4 text-center">Leaderboard</h2>
      <p className="text-white text-center mb-8">Ranked by highest total amount traded on events</p>
      <div className="grid grid-cols-6 gap-4 text-white border-b border-[#5C6BC0] pb-4 mb-4 text-lg font-bold">
        <div className="text-center">Rank</div>
        <div className="col-span-2">Name</div>
        <div className="text-center"># of trades</div>
        <div className="text-center">Win %</div>
        <div className="text-center">Total Traded</div>
      </div>
      {data.map((item, index) => (
        <motion.div
          key={index}
          className={`grid grid-cols-6 gap-4 text-white py-6 text-lg items-center ${
            index % 2 === 0 ? 'bg-[#3F51B5]/30' : ''
          } rounded-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex justify-center items-center">{getRankIcon(item.rank)}</div>
          <div className="col-span-2 flex items-center">
            <motion.div
              className="w-12 h-12 bg-[#D32F2F] rounded-full flex items-center justify-center mr-4 text-white font-bold"
              whileHover={{ scale: 1.1 }}
            >
              {item.name.charAt(0)}
            </motion.div>
            <span className="font-semibold">{item.name}</span>
          </div>
          <div className="text-center font-medium">{item.bets}</div>
          <div className="text-center font-medium">{item.win}</div>
          <div className="text-center font-bold text-[#D32F2F]">{item.bbxWon}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default LeaderboardTable;
