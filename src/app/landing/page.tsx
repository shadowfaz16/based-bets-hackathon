"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ExploreBetCard from "../_components/bets/ExploreBetCard";
import logo from "~/assets/header/logo.png";

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="pb-32 bg-gradient-to-br from-[#1A237E] to-[#3949AB] rounded-xl shadow-2xl overflow-hidden mb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section className="relative py-8 md:py-20 px-4 md:px-6 bg-[url('/hero-bg.jpg')] bg-cover bg-center" variants={itemVariants}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between md:space-x-12">
            <div className="text-center md:text-left md:w-1/2 mb-12 md:mb-0">
              <motion.h1 
                className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Peer-to-Peer Betting on the Blockchain 🎰
              </motion.h1>
              <motion.p 
                className="text-lg md:text-2xl text-white mb-12"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Create or match bets using Base Chain, PolitiF tokens, Based BRETT. Mainnet & more coming soon.
              </motion.p>
              <Link href="/whitepaper" className="bg-[#D32F2F] text-white text-sm md:text-xl font-bold py-3 px-6 rounded-full hover:bg-[#B71C1C] transition duration-300 hover:scale-105 inline-block">
                📄 Read Our Platform Overview
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              <motion.div
                className="absolute top-0 left-0 transform -translate-x-full -translate-y-1/2"
                initial={{ rotate: 0, scale: 1 }}
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                <div className="w-32 h-32 bg-[#D32F2F] rounded-full opacity-20 blur-xl"></div>
              </motion.div>
              <motion.h2
                className="text-4xl font-extrabold text-white mb-8 text-center md:text-left"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Featured Bet
              </motion.h2>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Link href="/explore" className="block transition-transform hover:scale-105">
                  <ExploreBetCard
                    image={logo}
                    side1="Trump"
                    side2="Kamala"
                    result=""
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section className="py-20 px-6 bg-[#283593] opacity-50" variants={itemVariants}>
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Why Choose BasedBets?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: "💼", title: "Multi-Currency Support", description: "Trade on events using ETH, USDT, or W tokens." },
            { icon: "🔒", title: "Secure & Transparent", description: "Blockchain-powered security and fairness for all trades." },
            { icon: "👥", title: "Customizable Positions", description: "Set your own odds or use global rates for event outcomes." }
          ].map((feature, index) => (
            <motion.div key={index} className="bg-[#1A237E] p-8 rounded-lg shadow-lg text-center" variants={itemVariants}>
              <div className="text-6xl mb-6">{feature.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-4">{feature.title}</h3>
              <p className="text-white text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section className="py-20 px-6" variants={itemVariants}>
        <h2 className="text-4xl font-bold text-white mb-12 text-center">How It Works</h2>
        <div className="max-w-6xl mx-auto">
          {[
            { icon: "📝", title: "Create a Position", description: "Specify amount, currency, and event outcome." },
            { icon: "💰", title: "Set Terms", description: "Choose custom or use global odds for the event." },
            { icon: "🤝", title: "Match Positions", description: "Accept existing positions on opposite outcomes." },
            { icon: "⏳", title: "Await Event Resolution", description: "Outcome is determined by contract owner." },
            { icon: "💸", title: "Settle Positions", description: "Claim your earnings securely based on the outcome." }
          ].map((step, index) => (
            <motion.div key={index} className="flex items-center mb-12 bg-[#283593] p-6 rounded-lg shadow-lg" variants={itemVariants}>
              <div className="text-6xl mr-8">{step.icon}</div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-white text-lg">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/rankings" className="bg-[#D32F2F] text-white text-xl font-bold py-4 px-8 rounded-full hover:bg-[#B71C1C] transition duration-300 hover:scale-105 inline-block">
            See the Rankings
          </Link>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer className="text-center py-12 bg-[#1A237E]" variants={itemVariants}>
        <div className="flex justify-center space-x-8 mb-8">
          <a href="#" className="text-white hover:text-[#D32F2F] text-lg">Terms of Service</a>
          <a href="#" className="text-white hover:text-[#D32F2F] text-lg">Privacy Policy</a>
          <a href="#" className="text-white hover:text-[#D32F2F] text-lg">Contact Us</a>
        </div>
        <div className="flex justify-center space-x-8 mb-8">
          <a href="#" className="text-white hover:text-[#D32F2F] text-2xl">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-white hover:text-[#D32F2F] text-2xl">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" className="text-white hover:text-[#D32F2F] text-2xl">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        <p className="text-white text-lg"> 2023 BasedBets. All rights reserved.</p>
        <p className="text-white text-md mt-4">Disclaimer: Betting involves risk. Please bet responsibly.</p>
      </motion.footer>
    </motion.div>
  );
};

export default LandingPage;
