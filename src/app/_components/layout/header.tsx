"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import invite from "~/assets/header/invite.svg";
import logo from "~/assets/header/logo.png";
import {
  ConnectButton,
  useSwitchActiveWalletChain,
  useActiveWalletChain,
  useActiveWalletConnectionStatus,
  useActiveAccount,
} from "thirdweb/react";
import { client } from "~/app/client";
import { base } from "thirdweb/chains";
import { useConnectModal } from "thirdweb/react";
import Link from "next/link";
import metamaskIcon from "~/assets/icons/metamask.svg";

const Header = () => {
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const activeWalletConnectionStatus = useActiveWalletConnectionStatus();
  const account = useActiveAccount();
  const { connect } = useConnectModal();
  const [isInviteHovered, setIsInviteHovered] = useState(false);

  async function handleConnect() {
    const wallet = await connect({ client, setActive: true });
  }

  useEffect(() => {
    const fetchData = async () => {
      if (
        activeWalletConnectionStatus === "connected" &&
        activeChain?.id !== base.id
      ) {
        await switchChain(base);
      }
    };
    fetchData().catch(console.error);
  }, [activeChain, switchChain, activeWalletConnectionStatus]);

  return (
    <div className="flex items-center justify-between py-4 relative">
      <div 
        className="absolute left-0 transition-all duration-300 ease-in-out relative"
        onMouseEnter={() => setIsInviteHovered(true)}
        onMouseLeave={() => setIsInviteHovered(false)}
      >
        <Image 
          src={invite as string} 
          alt="Invite" 
          width={25} 
          height={25}
          className={`transition-all duration-300 ${isInviteHovered ? 'scale-110 opacity-100' : 'opacity-70'}`}
        />
        {isInviteHovered && (
          <div className="absolute top-full mt-2 left-0 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
            Invite Friends
          </div>
        )}
      </div>
      <div className="flex-grow flex justify-center">
        <Link href="/" className="">
          <Image src={logo} alt="logo" width={120} height={100} />
        </Link>
      </div>
      <div className="absolute right-0">
        <ConnectButton
          detailsButton={{
            render() {
              return (
                <div className="transition-all duration-300 hover:scale-110">
                  <Image src={metamaskIcon as string} alt="metamask" width={25} height={25} />
                </div>
              );
            },
            displayBalanceToken: "0x3ae97aF8759c2822Ada1f9dE79acDd7a6690Aa0d",
          }}
          connectModal={{ size: "compact" }}
          connectButton={{
            label: "Connect",
            className: `
              px-4 py-2 min-w-[120px] h-10
              text-white bg-[#D32F2F] rounded-full
              border-none cursor-pointer
              text-sm font-bold
              transition-all duration-300 ease-in-out
              shadow-md
              hover:bg-[#B71C1C] hover:scale-105 hover:shadow-lg
            `,
          }}
          client={client}
        />
      </div>
    </div>
  );
};

export default Header;
