"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Whitepaper = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "smart-contract", title: "Smart Contract Overview" },
    { id: "key-features", title: "Key Features" },
    { id: "how-it-works", title: "How It Works" },
    { id: "technical-details", title: "Technical Details" },
    { id: "security", title: "Security Measures" },
    { id: "conclusion", title: "Conclusion" }
  ];

  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
      
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        const elem = document.getElementById(targetId);
        elem?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll as EventListener);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll as EventListener);
      });
    };
  }, []);

  return (
    <div className="flex pb-20">
      <motion.nav 
        className="w-64 bg-[#1A237E] p-6 fixed h-screen overflow-y-auto pb-32"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Contents</h2>
        <ul>
          {sections.map((section) => (
            <li key={section.id} className="mb-4">
              <a 
                href={`#${section.id}`} 
                className="text-white hover:text-[#D32F2F] transition-colors block py-2 px-4 rounded hover:bg-[#283593]"
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>

      <motion.div 
        className="ml-64 p-12 bg-gradient-to-br from-[#1A237E] to-[#3949AB] min-h-screen pb-32"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-5xl font-bold text-white mb-12 text-center"
          variants={itemVariants}
        >
          BasedBets Platform Overview
        </motion.h1>

        {sections.map((section) => (
          <motion.section 
            key={section.id} 
            id={section.id} 
            className="mb-16 bg-[#283593] p-8 rounded-lg shadow-lg" 
            variants={itemVariants}
          >
            <h2 className="text-3xl font-semibold text-white mb-6">{section.title}</h2>
            {section.id === "introduction" && (
              <p className="text-white mb-4">
                BasedBets is a decentralized betting platform that revolutionizes peer-to-peer betting using blockchain technology. Our platform enables users to create and participate in bets using multiple cryptocurrencies, ensuring transparency, security, and fairness in all betting activities.
              </p>
            )}
            {section.id === "smart-contract" && (
              <p className="text-white mb-4">
                The BasedBets smart contract is the backbone of our platform, facilitating peer-to-peer betting on events using multiple cryptocurrencies. Built on the Ethereum blockchain using Solidity, it allows users to create, match, and settle bets on specific outcomes with customizable odds.
              </p>
            )}
            {section.id === "key-features" && (
              <ul className="list-disc list-inside text-white space-y-2">
                <li>Multi-chain and multi-token support: Bet using Base Chain, Ethereum, DMCRCY, Based Brett, MAGA, and more (placeholder for future supported chains and tokens)</li>
                <li>Customizable odds: Set your own odds or use platform-wide odds</li>
                <li>Private bets: Create bets for specific users</li>
                <li>Transparent fee structure: Clear fees based on the currency used</li>
                <li>Secure withdrawals: Claim your winnings safely after event conclusion</li>
              </ul>
            )}
            {section.id === "how-it-works" && (
              <ol className="list-decimal list-inside text-white space-y-2">
                <li>Create a bet: Specify the amount, currency (ETH, USDT, or W), and the outcome you&apos;re betting on.</li>
                <li>Set odds: Choose custom odds or use our global odds.</li>
                <li>Match a bet: Other users can accept your bet by betting on the opposite outcome.</li>
                <li>Wait for the event: Once the event concludes, the contract owner determines the winning side.</li>
                <li>Withdraw winnings: If you&apos;ve won, claim your winnings minus the platform fee.</li>
              </ol>
            )}
            {section.id === "technical-details" && (
              <>
                <p className="text-white mb-4">
                  (Note: This section contains technical information that may be complex for non-technical readers.)
                </p>
                <ul className="list-disc list-inside text-white space-y-2">
                  <li>Smart Contract Language: Solidity on Ethereum blockchain</li>
                  <li>Bet Storage: Mapping structure indexed by betId</li>
                  <li>Odds Calculation: Supports both positive and negative odds</li>
                  <li>Fee Structure: Implemented in basis points (1 basis point = 0.01%)</li>
                  <li>Winner Decision: Controlled by contract owner</li>
                  <li>Event Cancellation: Allows for bet cancellation and refunds</li>
                </ul>
              </>
            )}
            {section.id === "security" && (
              <>
                <p className="text-white mb-4">
                  BasedBets prioritizes user security through:
                </p>
                <ul className="list-disc list-inside text-white space-y-2">
                  <li>Smart contract audits</li>
                  <li>ReentrancyGuard: Protection against reentrancy attacks</li>
                  <li>Restricted admin functions: Only contract owner can perform sensitive operations</li>
                  <li>Transparent event logging: All key actions are logged on the blockchain</li>
                </ul>
              </>
            )}
            {section.id === "conclusion" && (
              <p className="text-white mb-4">
                BasedBets offers a decentralized and secure way for users to create and participate in betting markets using multiple cryptocurrencies. Our platform combines advanced features like customizable odds and private bets with robust security measures, providing a transparent and fair betting experience.
              </p>
            )}
          </motion.section>
        ))}

        <motion.div className="text-center mt-12 mb-20" variants={itemVariants}>
          <Link href="/explore" className="inline-block bg-[#D32F2F] text-white font-bold py-3 px-6 rounded-full hover:bg-[#B71C1C] transition duration-300">
            Back to Explore
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Whitepaper;
