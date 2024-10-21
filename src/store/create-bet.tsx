import {create} from 'zustand';

interface CreateBetState {
  amount: number;
  currency: string;
  side: number | null;
  oddsSide1: string;
  oddsSide2: string;
  betIsPrivate: boolean;
  whitelistAddress: string;
  nativeTokenValue: number;
  currentStep: number;
  setAmount: (amount: number) => void;
  setCurrency: (currency: string) => void;
  setSide: (side: number) => void;
  setOddsSide1: (oddsSide1: string) => void;
  setOddsSide2: (oddsSide2: string) => void;
  setNativeTokenValue: (nativeTokenValue: number) => void;
  setCurrentStep: (step: number) => void;
  setBetIsPrivate: (betIsPrivate: boolean) => void;
  setWhitelistAddress: (whitelistAddress: string) => void;
}

const useCreateBetStore = create<CreateBetState>((set) => ({
  amount: 0,
  currency: 'ETH',
  side: null,
  oddsSide1: "",
  oddsSide2: "",
  nativeTokenValue: 0,
  currentStep: 1,
  betIsPrivate: false,
  whitelistAddress: '0x0000000000000000000000000000000000000000',
  setAmount: (amount) => set({ amount }),
  setCurrency: (currency) => set({ currency }),
  setSide: (side) => set({ side }),
  setOddsSide1: (oddsSide1) => set({ oddsSide1 }),
  setOddsSide2: (oddsSide2) => set({ oddsSide2 }),
  setNativeTokenValue: (nativeTokenValue) => set({ nativeTokenValue }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setBetIsPrivate: (betIsPrivate) => set({ betIsPrivate }),
  setWhitelistAddress: (whitelistAddress) => set({ whitelistAddress }),
}));

export default useCreateBetStore;