import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { prepareContractCall } from "thirdweb";
import { useSendTransaction } from "thirdweb/react";
import { contract } from "~/contract";
import { ImSpinner2 } from "react-icons/im";

const CancelBet = ({ onClose, id }: { onClose: () => void; id: number }) => {
  const { mutate: sendTransaction, isPending } = useSendTransaction();
  const router = useRouter();

  const onClick = () => {
    const transaction = prepareContractCall({
      contract,
      method: "function cancelBet(uint256 betId)",
      params: [BigInt(id)],
    });
    sendTransaction(transaction, {
      onSuccess: () => {
        toast.success("Bet cancelled successfully");
        onClose();
        setTimeout(() => {
          router.push("/my-bets");
        }, 1000);
      },
      onError: (error) => {
        toast.error("Failed to cancel bet");
        console.error("Error: ", error);
      },
    });
  };

  return (
    <div className="rounded-2xl bg-[#E49700] p-6">
      <h3 className="text-center text-xl font-bold">Cancel your bet?</h3>
      <hr className="border-1 mx-4 mt-2 border-[#020222]" />
      <div className="mt-4 flex items-center justify-between gap-4 text-[#020222]">
        <button
          className="w-full rounded-full border border-[#020222] bg-transparent p-2 text-[#020222] disabled:opacity-50"
          onClick={onClose}
          disabled={isPending}
        >
          {isPending ? <ImSpinner2 className="animate-spin" /> : "No"}
        </button>
        <button
          className="w-full rounded-full bg-[#020222] p-2 text-[#E49700] disabled:opacity-50"
          onClick={onClick}
          disabled={isPending}
        >
          {isPending ? <ImSpinner2 className="animate-spin" /> : "Yes"}
        </button>
      </div>
    </div>
  );
};

export default CancelBet;
