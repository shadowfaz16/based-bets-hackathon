import Image, { type StaticImageData } from "next/image";
import React from "react";
import { motion } from "framer-motion";
import jake from "~/assets/fighters/trump.jpeg";
import mike from "~/assets/fighters/kamala.jpeg";

type Props = {
  image: StaticImageData;
  side1: string;
  side2: string;
  result: string;
  onOpenModal?: () => void;
};

const ExploreBetCard = (props: Props) => {
  const { side1, side2, onOpenModal } = props;

  return (
    <motion.div 
      className="flex flex-col rounded-xl bg-[#1A237E] overflow-hidden w-full"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-3 p-4">
        <Image
          src={mike}
          alt={side1}
          width={100}
          height={100}
          className="rounded-xl border-2 border-[#D32F2F]"
        />
        <div className="text-center flex-grow">
          <h1 className="text-base font-bold text-white">{side1}</h1>
          <p className="text-lg font-semibold text-[#D32F2F]">vs</p>
          <h1 className="text-base font-bold text-white">{side2}</h1>
        </div>
        <Image
          src={jake}
          alt={side2}
          width={100}
          height={100}
          className="rounded-xl border-2 border-[#D32F2F]"
        />
      </div>
      <div className="flex justify-center mb-4">
        <div className="rounded-full flex justify-center py-2 border-2 border-[#D32F2F] px-6 bg-black/30">
          <span className="text-xs text-white font-semibold">
            9AM / Nov 5th, 2024
          </span>
        </div>
      </div>
      <motion.button 
        className="bg-[#D32F2F] py-3 flex justify-center items-center"
        whileHover={{ backgroundColor: "#B71C1C" }}
        onClick={onOpenModal}
      >
        <span className="text-white font-bold">
          Bet on this
        </span>
      </motion.button>
    </motion.div>
  );
};

export default ExploreBetCard;
