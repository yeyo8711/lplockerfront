import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useStore from "../store";
import lockerContractABI from "../ABIs";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";

function NewLock() {
  const {
    walletAddress,
    setPair,
    setLockSettingsScreen,
    setNewLock,
    setToken0Name,
    setToken1Name,
    token0Name,
    token1Name,
    signer,
    setPairAddress,
  } = useStore();
  const [address, setAddress] = useState("");
  const [lpBalance, setLpBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pairFound, setPairFound] = useState(false);

  useEffect(() => {
    if (address.length === 42) {
      try {
        const checkSumAddress = ethers.utils.getAddress(address);
        if (checkSumAddress) {
          setLoading(true);
          fetchPair();
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.message,
        });
      }
    } else {
      setPairFound(false);
      setLpBalance(0);
      setToken0Name(null);
      setToken1Name(null);
      setPair(null);
      setPairAddress(null);
    }
    // eslint-disable-next-line
  }, [address]);

  const fetchPair = async () => {
    const pair = new ethers.Contract(
      address,
      lockerContractABI.pairABI,
      signer
    );

    const tokenZeroAddress = await pair.token0();
    const tokenOneAddress = await pair.token1();
    const balance = ethers.utils.formatEther(
      await pair.balanceOf(walletAddress)
    );

    const tokenZeroContract = new ethers.Contract(
      tokenZeroAddress,
      lockerContractABI.ERC20ABI,
      signer
    );
    const tokenOneContract = new ethers.Contract(
      tokenOneAddress,
      lockerContractABI.ERC20ABI,
      signer
    );
    setToken0Name(await tokenZeroContract.symbol());
    setToken1Name(await tokenOneContract.symbol());
    setPairFound(true);
    setLpBalance(balance);
    setPairAddress(address);
    setPair(pair);
    setLoading(false);
  };

  const continueWithLock = () => {
    setLockSettingsScreen(true);
    setNewLock(false);
  };

  return (
    <div className='flex flex-col items-center justify-center max-h-screen mt-5'>
      <div className='bg-jean p-6 rounded-md flex flex-col'>
        Enter the Uniswap V2 pair address youd like to lock liquidity for
        <input
          className='border-lavender p-2 mt-2 rounded text-slate-950 text-center'
          placeholder='e.g 0x55F558D1a265AC31181D45Ad6B2052CD67eC8ABf'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      {loading ? (
        <div>
          <ReactLoading
            type={"balls"}
            color={"#00C988"}
            height={120}
            width={120}
          />
        </div>
      ) : pairFound ? (
        <div className='flex flex-col w-full rounded border-4 bg-[#E9EEF2] p-4 text-slate-950'>
          <div className='text-2xl m-2 text-slate-950'>Pair Found</div>
          <div className='flex justify-between m-2'>
            <div className='text-slate-950'>
              {token0Name} / {token1Name}
            </div>
            <div className='text-slate-950'>{lpBalance}</div>
          </div>
          <button
            className='px-4 py-2 rounded hover: text-white  transition duration-300 m-2 '
            style={{
              height: "70%",
              background:
                "linear-gradient(#fafbff 0%, #91bcf7 80%, #43567e 100%)",
              boxshadow: "#4c6b9b 0 -12px 6px inset",
              color: "#020019",
            }}
            onClick={() => continueWithLock()}>
            CONTINUE
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default NewLock;
