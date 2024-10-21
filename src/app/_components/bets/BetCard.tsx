import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import mike from '~/assets/fighters/kamala.jpeg'
import jake from '~/assets/fighters/trump.jpeg'

type Props = {
  id?: bigint;
  addr1?: string;
  addr2?: string;
  amount?: bigint;
  matched?: boolean;
  winner?: number;
  withdrawn?: boolean;
  side?: number | null;
  currency?: string;
  createdAt?: bigint;
  oddsSide1?: bigint;
  oddsSide2?: bigint;
  key?: number;
  image?: StaticImageData | string;
  name?: string;
  result?: string;
};

const BetCard = (props: Props) => {
  const { side, id } = props;

  return (
    <Link href={`/bet/${id}`} className="flex items-center gap-3 rounded-xl bg-[#3949AB] p-2">
      <Image
        src={side === 1 ? mike : jake}
        alt={side === 1 ? "mike" : "jake"}
        width={60}
        height={60}
        className="rounded-xl"
      />
      <div>
        <h1 className="font-semibold text-white">{side === 1 ? "Kamala Harris" : "Donald Trump"}</h1>
        <p className="font-semibold text-[#D32F2F]">to win</p>
      </div>
    </Link>
  );
};

export default BetCard;
