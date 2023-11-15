import React from "react";
import useStore from "../store";
import NewLock from "./NewLock";
import LockSettings from "./LockSettings";
import WithdrawLock from "./WithdrawLock";
import ViewAllLocks from "./ViewAllLocks";
import UniswapLogo from "../assets/uniswaplogo.png";
import Swal from "sweetalert2";
import ViewOneLock from "./ViewOneLock";
import { useParams } from "react-router-dom";

const Homepage = () => {
  const {
    newLock,
    isConnected,
    lockSettingsScreen,
    withdrawLock,
    resetBooleansExcept,
    viewAllLocks,
    viewOneLock,
  } = useStore();

  const { address } = useParams();

  const newLockClicked = (selection) => {
    if (
      isConnected ||
      selection === "viewAllLocks" ||
      selection === "viewOneLock"
    ) {
      resetBooleansExcept(selection);
    } else {
      Swal.fire("You must be connected first");
    }
  };

  React.useEffect(() => {
    if (address) {
      newLockClicked("viewOneLock");
    }
  }, [address]);

  let RenderComponent;
  if (newLock) {
    RenderComponent = NewLock;
  } else if (lockSettingsScreen) {
    RenderComponent = LockSettings;
  } else if (withdrawLock) {
    RenderComponent = WithdrawLock;
  } else if (viewAllLocks) {
    RenderComponent = ViewAllLocks;
  } else if (viewOneLock) {
    RenderComponent = ViewOneLock;
  }
  return (
    <div className='flex flex-col items-center justify-start  bg-storm p-6 min-h-[90vh] mt-10'>
      <div
        className='flex items-center mb-5 '
        style={{ backgroundImage: "url(background)" }}>
        <img src={UniswapLogo} alt='logo' className='h-10 w-10' />
        Uniswap v2 Liquidity Locker
      </div>
      <div class=' flex gap-8 justify-center items-center'>
        <button
          class='leading-none text-base no-underline font-normal flex  justify-center items-center gap-2 w-1/2 rounded-full p-3 text-[#020019]'
          style={{
            height: "70%",
            background:
              "linear-gradient(#fafbff 0%, #91bcf7 80%, #43567e 100%)",
            boxshadow: "#4c6b9b 0 -12px 6px inset",
            color: "#020019",
          }}
          onClick={() => newLockClicked("newLock")}>
          New
          <br /> Lock
        </button>
        <button
          class='leading-none text-base no-underline font-normal flex justify-center items-center gap-2 w-1/2 rounded-full p-3'
          style={{
            height: "70%",
            background:
              "linear-gradient(#fafbff 0%, #91bcf7 80%, #43567e 100%)",
            boxshadow: "#4c6b9b 0 -12px 6px inset",
            color: "#020019",
          }}
          onClick={() => newLockClicked("withdrawLock")}>
          Withdraw Lock
        </button>
        {/*   <button
          className='px-4 py-2 m-2 rounded bg-zinc-500 text-white hover:bg-zinc-600 transition duration-300 '
          onClick={() => newLockClicked("viewAllLocks")}>
          View All Locks
        </button> */}
        <button
          class='leading-none text-base no-underline font-normal flex justify-center items-center gap-2 w-1/2 rounded-full p-3'
          style={{
            height: "70%",
            background:
              "linear-gradient(#fafbff 0%, #91bcf7 80%, #43567e 100%)",
            boxshadow: "#4c6b9b 0 -12px 6px inset",
            color: "#020019",
          }}
          onClick={() => newLockClicked("viewOneLock")}>
          Search For Lock
        </button>
      </div>

      {RenderComponent && (
        <RenderComponent className='bg-jean p-6 rounded-md min-h-screen ' />
      )}
    </div>
  );
};

export default Homepage;
