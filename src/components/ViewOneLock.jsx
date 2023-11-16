import React, { useEffect, useState } from "react";
import useStore from "../store";
import { ethers } from "ethers";
import lockerContractABI from "../ABIs";
import Swal from "sweetalert2";
import ReactLoading from "react-loading";
import axios from "axios";
import CopyToClipboard from "react-copy-to-clipboard";
import back from "../assets/arrow.png";
import lock from "../assets/padlock.png";
import copy from "../assets/copy.png";
import checked from "../assets/checked.png";
import refresh from "../assets/refresh.png";
import weth from "../assets/weth.png";
import checkmark from "../assets/checkmark.png";
import questionmark from "../assets/questionmark.png";
import warning from "../assets/warning.png";
import danger from "../assets/danger.png";
import dextools from "../assets/dextools.png";
import { useParams } from "react-router-dom";

const ViewOneLock = () => {
  const { address } = useParams();
  const { baseURL, frontURL } = useStore();
  const [lpAddress, setLpAddress] = useState();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [totalLocked, setTotalLocked] = useState(0);
  const [allLocks, setAllLocks] = useState(null);

  const changeCopied = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    search(address);
  }, [address]);

  const search = async (lpAddress) => {
    if (lpAddress?.length !== 42) {
      setLpAddress(null);
      return;
    }
    try {
      const formatAddress = ethers.utils.getAddress(lpAddress);
      setLoading(true);

      await axios
        .get(`${baseURL}/getlockbyaddress`, {
          params: { lpAddress: formatAddress },
        })
        .then((res) => {
          setTokenInfo(res.data.data);
          console.log(res.data.data);
          setAllLocks(res.data.locks);
          setLoading(false);
          if (
            Number(res.data.data.percentInLPToken0) >
            Number(res.data.data.percentInLPToken1)
          ) {
            setTotalLocked(Number(res.data.data.percentInLPToken0));
          } else {
            setTotalLocked(Number(res.data.data.percentInLPToken1));
          }
        });
    } catch (error) {
      Swal.fire("Please enter a valid LP token address");
    }
  };

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

  return (
    <div className='flex flex-col justify-start items-center h-full '>
      <div className='w-full max-w-lg flex justify-center items-center m-2'>
        <input
          type='text'
          placeholder='Search...'
          className='flex-1 p-2 border rounded-l-md focus:outline-none focus:border-blue-500 text-slate-950 text-center'
          onChange={(e) => setLpAddress(e.target.value)}
        />
        <button
          className='bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition duration-200'
          onClick={() => search(lpAddress)}>
          Submit
        </button>
      </div>
      {tokenInfo ? (
        <section className='w-full min-h-screen text-white flex justify-center items-center'>
          <div className='bg-[#1E2023] rounded-[20px] w-[576px] p-[24px]'>
            {/* Back and Lock */}
            <div className='w-full flex justify-between'>
              <button
                className='flex justify-center items-center rounded-full p-2 hover:bg-[#303030] transition-all duration-300'
                onClick={() => setTokenInfo(null)}>
                <img src={back} alt='' className='w-6' />
              </button>

              <button className='flex items-center gap-3 py-2 px-6 bg-[#55A0FD] rounded-[30px]'>
                <img src={lock} alt='' className='w-5' /> Lock Liquidity
              </button>
            </div>

            {/* Stats */}
            <div className='flex w-full justify-center mt-5 gap-3'>
              <span>Uniswap V2 pair:</span>
              <CopyToClipboard
                text={`https://lp-locker-dapp.onrender.com/viewOneLock/${tokenInfo.lpAddress}`}
                onCopy={changeCopied}
                className='cursor-pointer flex items-center gap-2'>
                <span className='flex gap-2 items-center'>
                  SHARE
                  <img src={copied ? checked : copy} alt='' className='w-5' />
                </span>
              </CopyToClipboard>{" "}
            </div>

            {/* text */}
            <div className='flex flex-col mt-5 text-[20px]'>
              <span>
                1 {tokenInfo.token0Name} ={" "}
                {Number(tokenInfo.tokenTwoToOneRatio).toFixed(2)}{" "}
                {tokenInfo.token1Name}
              </span>
              <span>
                1 {tokenInfo.token1Name} ={" "}
                {Number(tokenInfo.tokenOneToTwoRatio).toFixed(2)}{" "}
                {tokenInfo.token0Name}
              </span>
            </div>

            {/* Graph */}
            <div className='flex flex-col mt-10'>
              <span className='text-center text-[#B9B3AE]'>
                Locked Liquidity
              </span>
              <span className='text-center text-[30px] font-bold'>
                {Number(tokenInfo.lpTotalLocked)} %
              </span>

              <div className='flex items-center justify-between mt-5'>
                <div className='rounded-full border-[4px] w-20 h-20 p-2'>
                  <img alt='img' src={questionmark} />
                </div>

                <span className='w-[140px] h-1 border-2 border-white'></span>

                <div className='rounded-full border-[2px] w-20 h-20 p-2'>
                  <img
                    className='rounded-full p-1 '
                    alt='img'
                    src={
                      totalLocked < 20
                        ? danger
                        : totalLocked < 50
                        ? warning
                        : checkmark
                    }
                  />
                </div>

                <span className='w-[140px] h-1 border-2 border-white'></span>

                <div className='rounded-full border-[4px] w-20 h-20 p-2'>
                  <img alt='img' src={weth} />
                </div>
              </div>

              <div className='flex justify-between w-full mt-3'>
                <div className='flex flex-col items-start'>
                  <span className='text-[28px]'>{tokenInfo.token0Name}</span>
                  <span>{tokenInfo.pairBalanceToken0}</span>
                  <div className='flex gap-2 mt-2'>
                    <span className='rounded-full w-10 h-10 bg-white'>
                      <img
                        alt='dex'
                        src={dextools}
                        onClick={() => {
                          const newWindow = window.open(
                            `https://www.dextools.io/app/en/ether/pair-explorer/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                          if (newWindow) newWindow.opener = null;
                        }}
                      />
                    </span>
                  </div>
                </div>

                <div className='flex flex-col items-end'>
                  <span className='text-[28px]'>{tokenInfo.token1Name}</span>
                  <span>{tokenInfo.pairBalanceToken1}</span>{" "}
                  <div className='flex gap-2 mt-2'>
                    <span className='rounded-full w-10 h-10 bg-white'>
                      <img
                        alt='dex'
                        src={dextools}
                        onClick={() => {
                          const newWindow = window.open(
                            `https://www.dextools.io/app/en/ether/pair-explorer/${tokenInfo.lpAddress}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                          if (newWindow) newWindow.opener = null;
                        }}
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* buttons */}
            <div className='flex items-center justify-center py-3 border-t border-b mt-8 border-white'>
              <img
                src={refresh}
                alt=''
                className='w-7 h-7 mr-3'
                onClick={() => search(lpAddress)}
              />
              <button
                className='flex items-center gap-3 py-2 px-6 hover:bg-[#303030] transition-all duration-300 rounded-[30px] '
                onClick={() => {
                  const newWindow = window.open(
                    `https://etherscan.io/token/${
                      tokenInfo.tokenOneAddress ===
                      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                        ? tokenInfo.tokenOneAddress
                        : tokenInfo.tokenZeroAddress
                    }`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                  if (newWindow) newWindow.opener = null;
                }}>
                Etherscan
              </button>
              <button
                className='flex items-center gap-3 py-2 px-6 hover:bg-[#303030] transition-all duration-300 rounded-[30px]'
                onClick={() => {
                  const newWindow = window.open(
                    `https://info.uniswap.org/`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                  if (newWindow) newWindow.opener = null;
                }}>
                Uniswap V2
              </button>
              <button
                className='flex items-center gap-3 py-2 px-6 hover:bg-[#303030] transition-all duration-300 rounded-[30px]'
                onClick={() => {
                  const newWindow = window.open(
                    `https://www.dextools.io/app/en/ether/pair-explorer/${tokenInfo.lpAddress}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                  if (newWindow) newWindow.opener = null;
                }}>
                Dextools
              </button>
            </div>

            {/* Reference */}
            <div className='flex flex-col text-[12px] mt-2'>
              <div className='flex justify-between w-full'>
                <span>Total LP tokens</span>
                <span>{tokenInfo.lpTotalSupply}</span>
              </div>
              <div className='flex justify-between w-full'>
                <span>Total locked LP</span>
                <span>{tokenInfo.lpTotalLocked}</span>
              </div>

              <span className='text-[#c63939] text-[16px]'>
                Uniswap V2 price API is down, dollar value not determinable
              </span>
            </div>

            {/* Text */}
            <div className='mt-5'>
              <h2 className='text-[20px] font-bold'>Liquidity Locks</h2>
              <p>
                Please be aware only the univ2 tokens are locked. Not the actual
                dollar value. This changes as people trade. More liquidity
                tokens are also minted as people add liquidity to the pool.
              </p>
            </div>

            {/* Footer */}
            {allLocks ? (
              <div className='mt-10'>
                <div className='flex justify-between m-2'>
                  <span>Value</span>
                  <span>Unlock date</span>
                </div>

                {allLocks.map((i) => {
                  const {
                    monthsDifference,
                    daysDifference,
                    hoursDifference,
                    minutesDifference,
                  } = getTimeDifference(i.unlocksAt);
                  return (
                    <div
                      key={i._id}
                      className='flex justify-between border-b-[1px] m-1'>
                      <div className='flex flex-col'>
                        <span>{i.amount}</span>
                        <span>{}</span>
                      </div>

                      <div className='flex flex-col items-end'>
                        <span className='flex'>
                          {i.unlocksAtFormatted}{" "}
                          <img src={lock} alt='' className='w-5 h-5' />
                        </span>
                        <span className='flex gap-2'>
                          <span className='flex flex-nowrap flex-1'>{`${monthsDifference}M ${daysDifference}D ${hoursDifference}h ${minutesDifference}m`}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              ""
            )}
          </div>
        </section>
      ) : loading ? (
        <div>
          <ReactLoading
            type={"balls"}
            color={"#00C988"}
            height={120}
            width={120}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ViewOneLock;
