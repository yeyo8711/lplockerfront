import React, { useState, useEffect } from "react";
import useStore from "../store";
import Swal from "sweetalert2";
import axios from "axios";
import ReactLoading from "react-loading";

const ViewAllLocks = () => {
  const { baseURL } = useStore();
  const [allLocks, setAllLocks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllLocks = async () => {
      setLoading(true);

      await axios.get(`${baseURL}/getalllocks`).then((res) => {
        setAllLocks(res.data.allLocks);
        setLoading(false);
      });
    };
    fetchAllLocks();
  }, []);

  const getTimeDifference = (unlocksAt) => {
    const timestamp1 = new Date().getTime(); // current time in milliseconds
    const timestamp2 = unlocksAt * 1000; // convert the given unix timestamp to milliseconds

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
      monthsDifference,
      daysDifference,
      hoursDifference,
      minutesDifference,
    };
  };

  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    Swal.fire("Address Copied");
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-fit'>
      <div className='bg-[#dfe4ec] p-6 mt-4 rounded-md w-full max-w-4xl'>
        <div className='flex items-center justify-center text-xl font-bold my-5'>
          Recent Locks
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
          ) : allLocks.length > 0 ? (
            allLocks.map((lock, index) => {
              const {
                token0Name,
                token1Name,
                amount,
                unlocksAt,
                lockedAtFormatted,
                unlocksAtFormatted,
                lpAddress,
              } = lock;

              const {
                monthsDifference,
                daysDifference,
                hoursDifference,
                minutesDifference,
              } = getTimeDifference(unlocksAt);

              return (
                <div
                  key={index}
                  className='flex flex-col md:flex-row justify-between p-2 border-[1px] border-y-emerald-50 rounded m-1 bg-[#dfe4ec] shadow-md'>
                  <div className='flex flex-col p-2 md:w-1/4'>
                    <span className='flex justify-center font-bold'>Pair</span>
                    <span>
                      {token0Name}/{token1Name}
                    </span>
                  </div>

                  <div className='flex flex-col p-2 md:w-1/4 md:mx-2'>
                    <span className='font-bold'>Amount</span>
                    <span>{Number(amount).toFixed(4)}</span>
                  </div>

                  <div className='flex flex-col p-2 md:w-1/4 md:mx-2'>
                    <span className='font-bold'>Locked At</span>
                    <span>{lockedAtFormatted}</span>
                  </div>

                  <div className='flex flex-col p-2 md:w-1/4 md:mx-2'>
                    <span className='font-bold'>Unlocks At</span>
                    <span>{unlocksAtFormatted}</span>
                  </div>

                  <div className='flex flex-col p-2 md:w-1/4 md:mx-2'>
                    <span className='font-bold '>Unlocks in </span>
                    <span className='flex flex-nowrap flex-1'>{`${monthsDifference}M ${daysDifference}D ${hoursDifference}h ${minutesDifference}m`}</span>
                  </div>

                  <div className='flex flex-col p-2 md:w-1/4 md:mx-2'>
                    <span className='font-bold'>LP Address</span>
                    <span
                      className='cursor-pointer'
                      onClick={() =>
                        copyToClipboard(lpAddress)
                      }>{`...${lpAddress.slice(36, 42)}`}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No Locks yet..</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ViewAllLocks;
