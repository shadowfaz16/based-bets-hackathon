import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import mike from "~/assets/fighters/kamala.jpeg";
import jake from "~/assets/fighters/trump.jpeg";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { contract } from "~/contract";

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
  whitelistedAddr?: string;
};

const MyBetCard = (props: Props) => {
  const {
    side,
    id,
    addr1,
    addr2,
    amount,
    currency,
    oddsSide1,
    oddsSide2,
    whitelistedAddr,
    winner,
    withdrawn,
  } = props;
  const address = useActiveAccount()?.address;

  const isCreator = addr1 === address;
  const isTaker = addr2 === address || whitelistedAddr === address;
  const isSettled = winner !== null && winner !== 0;

  let userSide, odds, oppositeSideOdds;
  if (isCreator) {
    userSide = side;
    odds = side === 1 ? Number(oddsSide1) : Number(oddsSide2);
    oppositeSideOdds = side === 1 ? Number(oddsSide2) : Number(oddsSide1);
  } else if (isTaker) {
    userSide = side === 1 ? 2 : 1;
    odds = side === 1 ? Number(oddsSide2) : Number(oddsSide1);
    oppositeSideOdds = side === 1 ? Number(oddsSide1) : Number(oddsSide2);
  }

  const betAmount = Number(amount) / 10 ** 18;

  let userBetAmount, potentialWin;
  if (isCreator) {
    userBetAmount = betAmount;
    if (odds && odds > 0) {
      potentialWin = (betAmount * odds) / 100;
    } else if (odds) {
      potentialWin = (betAmount * 100) / Math.abs(odds);
    } else {
      potentialWin = 0; // or some default value
    }
  } else {
    // Fix for taker's bet amount calculation
    potentialWin = betAmount;
    if (odds && odds > 0) {
      userBetAmount = (betAmount * 100) / odds;
    } else if (odds) {
      userBetAmount = (betAmount * Math.abs(odds)) / 100;
    } else {
      userBetAmount = 0; // or some default value
    }
  }

  userBetAmount = Math.abs(userBetAmount);

  const makerSide = Number(side);
  const takerSide = makerSide === 1 ? 2 : 1;

  const isWinner = (address === addr1 && winner === makerSide) ||
    (address === addr2 && winner === takerSide);

  console.log("isWinner", isWinner);
  console.log("winner", winner);
  console.log("address", address);
  console.log("addr1", addr1);
  console.log("addr2", addr2);
  console.log("makerSide", makerSide);
  console.log("takerSide", takerSide);

  return (
    <Link
      href={`/bet/${id}`}
      className="relative flex items-center justify-between overflow-hidden rounded-xl bg-[#3949AB] p-2"
    >
      {isSettled && isWinner && (
        <div className="absolute -right-12 top-4 z-10 rotate-45">
          <div className="transform bg-gradient-to-r from-green-400 to-green-600 px-10 py-1  text-[10px] font-bold text-black shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 text-left">
            <p className="pr-3">
            {withdrawn ? "Claimed" : "Claim"}
            </p>
          </div>
        </div>
      )}
      {isSettled && !isWinner && (
        <div className="absolute -right-12 top-4 z-10 rotate-45">
          <div className="bg-gradient-to-r from-red-400 to-red-600 px-10 py-1 text-center text-[10px] font-bold text-black shadow-lg">
            <p className="pr-3">
              Bet Lost
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <Image
          src={userSide === 1 ? mike : jake}
          alt={userSide === 1 ? "mike" : "jake"}
          width={60}
          height={60}
          className="rounded-xl"
        />
        <div>
          <h1 className="font-semibold text-white">
            {userSide === 1 ? "Kamala Harris" : "Donald Trump"}
          </h1>
          <p className="font-semibold text-[#D32F2F]">
            {odds && odds > 0 ? `+${odds}` : odds}
          </p>
        </div>
        {/* <p className="text-xs text-white">user side: {userSide}</p>
        <p className="text-xs text-white">winner: {winner}</p>
        <p className="text-xs text-white">isWinner: {isWinner.toString()}</p>
        <p className="text-xs text-white">address: {address}</p> */}
      </div>
      <div>
        {!isSettled && (
          <div className="text-right">
            <p className="text-xs text-white">
              Bet: {userBetAmount.toFixed(4)} {currency}
            </p>
            <p className="text-xs text-white">
              Win: {potentialWin.toFixed(4)} {currency}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MyBetCard;
