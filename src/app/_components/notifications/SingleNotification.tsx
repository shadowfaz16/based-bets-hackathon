import Image, { type StaticImageData } from "next/image";
import React from "react";

type Props = {
  image: StaticImageData;
  title: string;
  action: string;
};

const SingleNotification = (props: Props) => {
  const { image, title, action } = props;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-[#3949AB]/50 p-4">
      <Image
        {...image}
        alt={title}
        width={50}
        height={50}
        className="rounded-xl"
      />
      <div>
        <h1 className="font-semibold text-white">{title}</h1>
        <p className="font-semibold text-[#D32F2F]">{action}</p>
      </div>
    </div>
  );
};

export default SingleNotification;
