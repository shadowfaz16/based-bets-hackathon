import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  image: StaticImageData;
  name: string;
  result: string;
};

const SelectedBetCard = (props: Props) => {
  const { image, name } = props;

  return (
    <Link href='/my-bet' className="w-full flex flex-col rounded-xl bg-[#3949AB]/50 p-2">
        <div className="flex items-start justify-between gap-3">
      <Image
        src={image}
        alt={name}
        width={80}
        height={80}
        className="rounded-xl"
      />
      <div className="text-center">
        <h1 className="font-semibold text-white">{name}</h1>
        <p className="font-semibold text-[#D32F2F]">vs</p>
        <h1 className="font-semibold text-white">Donald Trump</h1>
      </div>
      <Image
        src={image}
        alt={name}
        width={80}
        height={80}
        className="rounded-xl"
      />
        </div>
        <div className="flex justify-center">
        <div className="rounded-full flex justify-center py-1 border border-[#D32F2F] px-4 w-40">
            <span className="text-xs text-white">
            9AM / Nov 5th.2024
            </span>
        </div>
        </div>
    </Link>
  );
};

export default SelectedBetCard;
