import Image, { type StaticImageData } from "next/image";
import React from "react";
import jake from "~/assets/fighters/trump.jpeg";
import mike from "~/assets/fighters/kamala.jpeg";

type Props = {
  image: StaticImageData;
  side1: string;
  side2: string;
  result: string;
};

// TODO: pass props to the card from the backend

const TakeBetCard = (props: Props) => {
  const { side1, side2 } = props;

  const date = new Date("2024-11-05T20:00:00");
  const now = new Date();
  const timeUntil = date.getTime() - now.getTime();
  const days = Math.floor(timeUntil / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <>
      <div className="flex w-full flex-col rounded-xl bg-[#1A237E]">
        <div className="flex items-start justify-between gap-3 p-4">
          <Image
            src={mike}
            alt={side1}
            width={80}
            height={80}
            className="rounded-xl"
          />
          <div className="text-center">
            <h1 className="text-sm font-semibold text-white">Kamala Harris</h1>
            <p className="font-semibold text-[#D32F2F]">vs</p>
            <h1 className="text-sm font-semibold text-white">Donald Trump</h1>
          </div>
          <Image
            src={jake}
            alt={side2}
            width={80}
            height={80}
            className="rounded-xl"
          />
        </div>
        <div className="flex justify-center">
          <div className="flex w-40 justify-center rounded-full border-2 border-[#D32F2F] px-4 py-1">
            <span className="text-xs text-white">9AM / Nov 5th.2024</span>
          </div>
        </div>
        <div className="mt-4 flex justify-center rounded-b-xl bg-[#D32F2F] py-1">
          <span className="text-center font-bold text-white">
            EXP: {days}d {hours}h {minutes}m
          </span>
        </div>
      </div>
    </>
  );
};

export default TakeBetCard;
