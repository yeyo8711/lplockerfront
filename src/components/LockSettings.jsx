import React, { useEffect, useState } from "react";
import useStore from "../store";
import { ethers } from "ethers";
import { FaArrowLeft } from "react-icons/fa";
import Datepicker from "react-tailwindcss-datepicker";
import lockerContractABI from "../ABIs";
import Swal from "sweetalert2";

function TokenInfo() {
  const {
    pair,
    setLockSettingsScreen,
    walletAddress,
    setNewLock,
    token0Name,
    token1Name,
    provider,
    lockerContract,
    pairAddress,
    setPairAddress,
    setWithdrawLock,
  } = useStore();

  const [balance, setBalance] = useState(0);
  const [hasEnoughETH, setHasEnoughETH] = useState(false);
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [timestamp, setTimestamp] = useState(0);
  const [formattedDate, setFormattedDate] = useState("");
  const [difference, setDifference] = useState("");
  const [finalUnixtimestamp, setFinalUnixtimestamp] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    fetchBalance();
    // eslint-disable-next-line
  }, []);

  // Mock function to check if user has enough ETH. Replace with your logic.
  useEffect(() => {
    const checkETHBalance = async () => {
      const userBalance = ethers.utils.formatEther(
        await provider.getBalance(walletAddress)
      );
      if (userBalance >= 0.05) {
        // example threshold
        setHasEnoughETH(true);
      } else {
        setHasEnoughETH(false);
      }
    };

    checkETHBalance();
  }, [walletAddress, provider]); // Run this effect once when component mounts.

  useEffect(() => {
    setTimestamp(value.endDate);
    const date = new Date(timestamp);

    const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      date.getUTCDay()
    ];
    const day = date.getUTCDate();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[date.getUTCMonth()];
    const year = date.getUTCFullYear();

    const result = `${dayName} ${day} ${monthName} ${year}`;
    setFormattedDate(result);

    const today = new Date();

    // Reset hours, minutes, seconds, and milliseconds for comparison
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() < today.getTime()) {
      setDifference("0 months and 0 days");
    } else {
      let monthDifference =
        (date.getFullYear() - today.getFullYear()) * 12 +
        date.getMonth() -
        today.getMonth();
      let dayDifference = date.getDate() - today.getDate();

      // If day difference is negative, borrow a month to convert it to positive days
      if (dayDifference < 0) {
        monthDifference -= 1;
        const daysInPrevMonth = new Date(
          date.getFullYear(),
          date.getMonth(),
          0
        ).getDate();
        dayDifference += daysInPrevMonth;
      }

      setDifference(`${monthDifference} months and ${dayDifference + 1} days`);
    }
  }, [value, timestamp]);

  useEffect(() => {
    allow();
    // eslint-disable-next-line
  }, [walletAddress, amount]);

  const allow = async () => {
    const allowanceToContract = Number(
      ethers.utils.formatEther(
        await pair.allowance(walletAddress, lockerContractABI.address)
      )
    );
    if (Number(allowanceToContract) >= Number(amount)) {
      setAllowance(true);
    } else {
      setAllowance(false);
    }
  };

  const handleValueChange = (newValue) => {
    const unixtimeMilliseconds =
      new Date(newValue.endDate).getTime() + 86400000;

    const unixtimeSeconds = Math.floor(unixtimeMilliseconds / 1000);

    setValue(newValue);
    setFinalUnixtimestamp(unixtimeSeconds);
  };

  const fetchBalance = async () => {
    const formattedBalance = ethers.utils.formatEther(
      await pair.balanceOf(walletAddress)
    );
    setBalance(formattedBalance);

    const lpName = await pair.name();
    setName(lpName);
  };
  const goToLocksScreen = () => {
    setLockSettingsScreen(false);
    setPairAddress(false);
    setNewLock(false);
    setWithdrawLock(true);
  };

  const goBack = () => {
    setLockSettingsScreen(false);
    setNewLock(true);
    setPairAddress(null);
  };

  const approve = async () => {
    if (!amount || !finalUnixtimestamp) return;
    try {
      const tx = await pair.approve(
        lockerContractABI.address,
        ethers.utils.parseEther(amount.toString())
      );
      await tx.wait();
      allow();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  const lock = async () => {
    try {
      const tx = await lockerContract.lock(
        pairAddress,
        finalUnixtimestamp,
        ethers.utils.parseEther(amount.toString()),
        { value: ethers.utils.parseEther("0.05") }
      );
      await tx.wait();
      Swal.fire({
        title: "Success!",
        text: "You have locked liquidity",
        icon: "success",
        confirmButtonText: "Cool",
      }).then((result) => {
        if (result.isConfirmed) {
          goToLocksScreen();
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };

  return (
    <div className='flex flex-colitems-center justify-center min-h-fit bg-[#E9EEF2]'>
      <div className='bg-[#dfe4ec] p-6 mt-4 rounded-md'>
        <div className='m-2 cursor-pointer'>
          <FaArrowLeft onClick={() => goBack()} />
        </div>
        <div className='flex items-center justify-center text-3xl'>
          {token0Name ? token0Name : ""} / {token1Name ? token1Name : ""}
        </div>
        <div className='flex items-center justify-center text-xl font-bold	 my-5'>
          Lock how many LP tokens?
        </div>
        <div className='bg-[#E9EEF2] border-2 rounded-md p-3 m-3'>
          <p className='text-soft-grey flex justify-end text-xs bg-[#E9EEF2]'>
            Balance: {balance ? balance : 0}
          </p>
          <div className='flex justify-between items-center m-4 bg-[#F5F7F9] rounded p-2'>
            <div>{amount ? amount : 0}</div>
            <div className='flex justify-end items-center ml-4'>
              {name}
              <button
                className='px-4 py-2 ml-2 rounded bg-green-500 text-white hover:bg-green-600 transition duration-300 '
                onClick={() => setAmount(balance)}>
                MAX
              </button>
            </div>
          </div>
          <div>
            <button
              className='bg-[#E9EEF2] border-2 rounded-md p-2 text-xs'
              onClick={() => setAmount(balance * 0.25)}>
              25%
            </button>
            <button
              className='bg-[#E9EEF2] border-2 rounded-md p-2 text-xs'
              onClick={() => setAmount(balance * 0.5)}>
              50%
            </button>
            <button
              className='bg-[#E9EEF2] border-2 rounded-md p-2 text-xs'
              onClick={() => setAmount(balance * 0.75)}>
              75%
            </button>
            <button
              className='bg-[#E9EEF2] border-2 rounded-md p-2 text-xs'
              onClick={() => setAmount(balance)}>
              100%
            </button>
          </div>
        </div>
        <div className='flex items-center justify-center text-xl font-bold	 my-5'>
          Unlock Date
        </div>
        <div className='bg-[#E9EEF2] border-2 rounded-md p-3 m-3'>
          <div className='max-w-fit m-2'>
            <div className='flex flex-col justify-between items-center m-4 bg-[#F5F7F9] rounded p-2'>
              (All locks end at 0 UTC)
              <Datepicker
                value={value}
                onChange={handleValueChange}
                primaryColor={"fuchsia"}
                showShortcuts={false}
                asSingle={true}
                placeholder={"Select Unlock Date"}
                minDate={new Date()}
              />
            </div>
          </div>
          <div className='flex justify-center items-center'>{difference}</div>
        </div>
        <div className='flex items-center justify-center text-xl font-bold	 my-5'>
          Fee Options
        </div>
        <div className='bg-[#E9EEF2] border-2 rounded-md p-3 m-3'>
          <div className='flex flex-1 justify-center items-center m-2 bg-[#F5F7F9] rounded p-2'>
            <button className='px-4 py-2 w-full h-full rounded bg-green-500 text-white hover:bg-green-600 transition duration-300 '>
              0.05 ETH + 1%
            </button>
          </div>
        </div>
        <div className='flex items-center justify-center text-m  my-5'>
          <p className='flex flex-col max-w-sm'>
            Once tokens are locked they cannot be withdrawn under any
            circumstances until the timer has expired. Please ensure the
            parameters are correct, as they are final.
          </p>
        </div>
        <div className='p-4 flex'>
          <button
            className={`flex-1 px-4 py-2 rounded ${
              hasEnoughETH && finalUnixtimestamp && amount
                ? "bg-green-500"
                : "bg-gray-400"
            } text-white`}
            disabled={!hasEnoughETH && !finalUnixtimestamp && !amount}
            onClick={() => approve()}>
            Approve
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded ml-2 ${
              hasEnoughETH && finalUnixtimestamp && amount && allowance
                ? "bg-green-500"
                : "bg-gray-400"
            } text-white`}
            disabled={
              !hasEnoughETH || !finalUnixtimestamp || !amount || !allowance
            }
            onClick={() => lock()}>
            Lock
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenInfo;
