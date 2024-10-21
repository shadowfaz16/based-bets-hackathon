import Image, { type StaticImageData } from "next/image";
import React from "react";
import jake from "~/assets/fighters/trump.jpeg";
import useCreateBetStore from "~/store/create-bet";

type Props = {
  image: StaticImageData;
  name: string;
  result: string;
};

const SelectBetCard = (props: Props) => {
  const { image, name } = props;
  const { setCurrentStep } = useCreateBetStore();

  const handleNext = () => {
    setCurrentStep(2);
  };

  return (
    <div className="w-full flex flex-col rounded-xl bg-[#3949AB]/50 cursor-pointer"
    onClick={handleNext}
    >
        <div className="flex items-start justify-between gap-3 p-2">
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
        src={jake}
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
        <div className="bg-[#D32F2F] rounded-b-xl mt-4 flex justify-center py-1">
            <span className="text-white text-center">
                Select this event
            </span>
        </div>
    </div>
  );
};

export default SelectBetCard;
