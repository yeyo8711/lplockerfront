import React, { useEffect, useState } from "react";
import useStore from "../store";
import { ethers } from "ethers";
import lockerContractABI from "../ABIs";
import Swal from "sweetalert2";
import ReactLoading from "react-loading";
import axios from "axios";

const WithdrawLock = () => {
  const { walletAddress, provider, lockerContract, baseURL } = useStore();

  const [myLocks, setMyLocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetch = async () => {
      const totalLocks = Number(
        ethers.utils.formatUnits(
          await lockerContract.lockerNumber(walletAddress),
          0
        )
      );
      let arr = [];
      let arr2 = [];
      if (totalLocks === 0) {
        setLoading(false);
        return;
      }
      for (let i = 0; i < totalLocks; i++) {
        const lock = await lockerContract.viewLock(walletAddress, i);
        arr2.push({
          owner: lock[0],
          lpAddress: lock[1],
          lockedAt: lock[2],
          amount: lock[3],
          unlocksAt: lock[4],
        });
        const {
          token0Name,
          token1Name,
          amount,
          lockedAt,
          unlocksAt,
          monthsDifference,
          daysDifference,
          hoursDifference,
          minutesDifference,
          lockedAtFormatted,
          unlocksAtFormatted,
        } = await fetchAndFormat(lock);

        arr.push({
          token0Name,
          token1Name,
          amount,
          lockedAt,
          unlocksAt,
          monthsDifference,
          daysDifference,
          hoursDifference,
          minutesDifference,
          lpAddress: lock.lpAddress,
          owner: lock.owner,
          ended: lock.ended,
          lockedAtFormatted,
          unlocksAtFormatted,
        });
      }
      setMyLocks(arr);
      updateDB(arr2);
      setLoading(false);
    };
    fetch();
    // eslint-disable-next-line
  }, []);

  const updateDB = async (arr) => {
    try {
      await axios.get(`${baseURL}/refreshdb`, {
        params: { arr },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAndFormat = async (lock) => {
    const pair = new ethers.Contract(
      lock.lpAddress,
      lockerContractABI.pairABI,
      provider
    );

    const tokenZeroAddress = await pair.token0();
    const tokenOneAddress = await pair.token1();

    const tokenZeroContract = new ethers.Contract(
      tokenZeroAddress,
      lockerContractABI.ERC20ABI,
      provider
    );
    const tokenOneContract = new ethers.Contract(
      tokenOneAddress,
      lockerContractABI.ERC20ABI,
      provider
    );
    const token0Name = await tokenZeroContract.symbol();
    const token1Name = await tokenOneContract.symbol();

    const amount = Number(ethers.utils.formatEther(lock.amount), 0);
    const lockedAt = Number(lock.lockedAt);
    const lockedAtFormatted = convertFromUnix(lockedAt);

    const unlocksAt = Number(lock.unlocksAt);
    const unlocksAtFormatted = convertFromUnix(unlocksAt);

    const timestamp1 = lockedAt * 1000; // multiply by 1000 to convert from seconds to milliseconds
    const timestamp2 = unlocksAt * 1000; // multiply by 1000 to convert from seconds to milliseconds

    const differenceMilliseconds = timestamp2 - timestamp1;

    // Define constants for conversions
    const millisecondsPerMinute = 60 * 1000;
    const millisecondsPerHour = 60 * millisecondsPerMinute;
    const millisecondsPerDay = 24 * millisecondsPerHour;
    const averageMillisecondsPerMonth = 30.44 * millisecondsPerDay;

    // Calculate the difference in months, days, hours, and minutes
    const monthsDifference = Math.floor(
      differenceMilliseconds / averageMillisecondsPerMonth
    );
    const daysDifference = Math.floor(
      (differenceMilliseconds % averageMillisecondsPerMonth) /
        millisecondsPerDay
    );
    const hoursDifference = Math.floor(
      (differenceMilliseconds % millisecondsPerDay) / millisecondsPerHour
    );
    const minutesDifference = Math.floor(
      (differenceMilliseconds % millisecondsPerHour) / millisecondsPerMinute
    );

    return {
      token0Name,
      token1Name,
      amount,
      lockedAt,
      unlocksAt,
      monthsDifference,
      daysDifference,
      hoursDifference,
      minutesDifference,
      lockedAtFormatted,
      unlocksAtFormatted,
    };
  };

  const convertFromUnix = (timestamp) => {
    // Convert the Unix timestamp to a JavaScript Date object
    const date = new Date(timestamp * 1000); // multiply by 1000 to convert from seconds to milliseconds

    // Extract month, day, and year
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed in JavaScript
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2); // Get the last two digits of the year

    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  };

  const withdrawLock = async (index) => {
    try {
      const tx = await lockerContract.withdraw(index);
      await tx.wait();
      Swal.fire({
        title: "Success!",
        text: "You have unlocked liquidity",
        icon: "success",
        confirmButtonText: "Cool",
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
    <div className='flex flex-col items-center justify-center min-h-fit bg-[#E9EEF2]'>
      <div className='bg-[#dfe4ec] p-6 mt-4 rounded-md w-full max-w-4xl'>
        <div className='flex items-center justify-center text-xl font-bold my-5'>
          My Locker
        </div>
        <div className='bg-[#E9EEF2]  border-2 rounded-md p-3 m-3 '>
          {loading ? (
            <div>
              <ReactLoading
                type={"balls"}
                color={"#00C988"}
                height={120}
                width={120}
              />
            </div>
          ) : myLocks.length > 0 ? (
            myLocks.map((lock, index) => {
              const withdrawable =
                Math.floor(Date.now() / 1000) >= lock.unlocksAt;
              const {
                token0Name,
                token1Name,
                amount,
                monthsDifference,
                daysDifference,
                hoursDifference,
                minutesDifference,
                lpAddress,
                ended,
                lockedAtFormatted,
                unlocksAtFormatted,
              } = lock;

              return (
                <div
                  key={index}
                  className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#F5F7F9]   p-2 rounded border-black border-b-[1px]'>
                  <div className='flex flex-col m-2'>
                    <span className='flex justify-center items-center font-bold'>
                      Pair
                    </span>
                    <span>
                      {token0Name}/{token1Name}
                    </span>
                  </div>

                  <div className='flex flex-col m-2'>
                    <span className='font-bold'>Amount</span>
                    <span>{Number(amount).toFixed(4)}</span>
                  </div>
                  <div className='flex flex-col m-2'>
                    <span className='font-bold'>Locked At</span>
                    <span>{lockedAtFormatted}</span>
                  </div>
                  <div className='flex flex-col m-2'>
                    <span className='font-bold'>Unlocks At</span>
                    <span>{unlocksAtFormatted}</span>
                  </div>
                  <div className='flex  flex-col m-2'>
                    <span className='font-bold '>Unlocks in </span>
                    <span>{`${monthsDifference}M ${daysDifference}D ${hoursDifference}h ${minutesDifference}m`}</span>
                  </div>

                  <div className='flex flex-col m-2'>
                    <span className='font-bold'>LP Address</span>
                    <span>{`...${lpAddress.slice(36, 42)}`}</span>
                  </div>
                  {/* <div className='flex flex-col'>
                        <span>Owner</span>
                        <span>{owner}</span>
                      </div> */}
                  <div className='flex flex-col'>
                    <button
                      className={`flex-1 px-2 py-2 rounded ml-2 ${
                        withdrawable && !lock.ended
                          ? "bg-green-500"
                          : "bg-gray-400"
                      } text-white`}
                      disabled={lock.ended}
                      onClick={() => withdrawLock(index)}>
                      {lock.ended ? "Ended" : "Withdraw"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div>YOU HAVE NO LOCKED LIQUIDITY</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawLock;
