import { create } from "zustand";

const useStore = create((set) => ({
  walletAddress: "0x00000000000000000000000000",
  defaultProvider: "https://rpc.ankr.com/eth_goerli",
  baseURL: "https://lplockerserver.onrender.com",
  isConnected: false,
  signer: "",
  lockerContract: "",
  newLock: false,
  pairAddress: "",
  pair: {},
  lockSettingsScreen: false,
  token0Name: "",
  token1Name: "",
  provider: "",
  withdrawLock: false,
  viewAllLocks: false,
  viewOneLock: false,
  updateSigner: (state) => set({ signer: state }),
  setIsConnected: (state) => set({ isConnected: state }),
  setWalletAddress: (state) => set({ walletAddress: state }),
  updateLockerContract: (state) => set({ lockerContract: state }),
  setNewLock: (state) => set({ newLock: state }),
  setPair: (state) => set({ pair: state }),
  setLockSettingsScreen: (state) => set({ lockSettingsScreen: state }),
  setToken0Name: (state) => set({ token0Name: state }),
  setToken1Name: (state) => set({ token1Name: state }),
  setProvider: (state) => set({ provider: state }),
  setPairAddress: (state) => set({ pairAddress: state }),
  setWithdrawLock: (state) => set({ withdrawLock: state }),
  resetBooleansExcept: (property) => {
    set({
      withdrawLock: false,
      lockSettingsScreen: false,
      newLock: false,
      viewAllLocks: false,
      viewOneLock: false,
      [property]: true,
    });
  },
}));

export default useStore;
