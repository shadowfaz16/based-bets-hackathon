import Image, { type StaticImageData } from "next/image";
import React from "react";

type Props = {
  image: StaticImageData;
  name: string;
  odds: string | number;
  amount?: string | number;
  currency?: string;
};

const BetWinnerCard = (props: Props) => {
  const { image, name, odds, amount, currency } = props;

  return (
    <div
      className="flex w-full flex-col rounded-xl bg-[#0a0826] p-3"
    >
      <div className="flex gap-3">
        <div className="">
        <Image
          {...image}
          alt={name}
          width={80}
            height={80}
            className="h-28 rounded-xl object-cover"
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="h-full">
            <h1 className="font-semibold text-white">{name}</h1>
            <p className="font-medium text-[#D32F2F]">{String(odds).startsWith('+') ? odds : Number(odds) >= 0 ? `+${odds}` : odds}</p>
            <p className="font-medium text-[#D32F2F]">{amount ? (Number(amount)) : null} {currency ? currency.toUpperCase() : null}</p>
          </div>
          <div className="flex w-40 justify-center rounded-full border border-[#D32F2F] px-4 py-1 mt-4">
            <span className="text-xs text-white">9AM / Nov 5th.2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetWinnerCard;
