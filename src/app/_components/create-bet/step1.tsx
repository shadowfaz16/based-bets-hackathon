'use client'
import React, { useState } from "react";
import mike from "~/assets/fighters/kamala.jpeg";
import SelectBetCard from "../bets/SelectBetCard";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const CreateBetStep1 = () => {
  const [openCategories, setOpenCategories] = useState<string[]>(["Elections"]);

  const categories = [
    { name: "Elections", content: <SelectBetCard image={mike} name="Kamala Harris" result="Loss" /> },
    { name: "UFC", content: "Coming soon" },
    { name: "Soccer", content: "Coming soon" },
    { name: "Hockey", content: "Coming soon" },
    { name: "Basketball", content: "Coming soon" },
    { name: "Baseball", content: "Coming soon" },
    { name: "Football", content: "Coming soon" },
    { name: "Rugby", content: "Coming soon" },
  ];

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="pb-24">
      <div className="mt-6">
        <h3 className="text-2xl font-semibold text-white">Select your event</h3>
        <hr className="border-1 my-4 border-[#D32F2F]" />
      </div>
      {categories.map((category) => (
        <div key={category.name} className="mt-6">
          <button
            className="w-full flex items-center justify-between text-white"
            onClick={() => toggleCategory(category.name)}
          >
            <h3 className="text-2xl font-semibold">{category.name}</h3>
            {openCategories.includes(category.name) ? <BsChevronUp /> : <BsChevronDown />}
          </button>
          <hr className="border-1 my-3 border-[#D32F2F]" />
          <AnimatePresence>
            {openCategories.includes(category.name) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {typeof category.content === "string" ? (
                  <p className="text-lg text-white">{category.content}</p>
                ) : (
                  category.content
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default CreateBetStep1;
