import React, { useEffect } from "react";
import useStore from "../store";
import { ethers } from "ethers";
import lockerContractABI from "../ABIs";
import Swal from "sweetalert2";

function Header() {
  const {
    isConnected,
    setIsConnected,
    updateSigner,
    walletAddress,
    setWalletAddress,
    updateLockerContract,
    setProvider,
  } = useStore();

  const connect = async () => {
    try {
      // A Web3Provider wraps a standard Web3 provider, which is
      // what MetaMask injects as window.ethereum into each page
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      const network = await provider.getNetwork();
      if (network.chainId !== 1) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please change to the correct network",
        });
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1" }], // 0x3 is the chain ID for Ropsten
        });
        provider.on("network", (newNetwork, oldNetwork) => {
          // When a Provider makes its initial connection, it emits a "network"
          // event with a null oldNetwork along with the newNetwork. So, if the
          // oldNetwork exists, it represents a changing network
          if (oldNetwork) {
            window.location.reload();
          }
        });
      }

      // MetaMask requires requesting permission to connect users accounts
      const account = await provider.send("eth_requestAccounts", []);

      // The MetaMask plugin also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, you need the account signer...
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        lockerContractABI.address,
        lockerContractABI.ABI,
        signer
      );

      updateSigner(signer);
      setWalletAddress(account[0]);
      setIsConnected(true);
      updateLockerContract(contract);
      setProvider(provider);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  return (
    <div className='w-full bg-[#F5F7F9] p-4 shadow-md'>
      <div className='flex justify-between items-center mx-auto'>
        <h1 className='text-2xl text-soft-grey'>Liquidity Locker</h1>
        {isConnected ? (
          <span className='text-soft-grey bg-jean p-2 rounded-md'>
            {walletAddress.slice(-8)}
          </span>
        ) : (
          <button
            className='bg-[#E9EEF2] text-soft-grey p-3 rounded-md hover:bg-[#b5b8bb]'
            onClick={() => {
              connect();
            }}>
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
