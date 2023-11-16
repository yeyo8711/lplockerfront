import React from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaTelegram } from "react-icons/fa";
const Footer = () => {
  return (
    <div className='flex items-center justify-center '>
      <div className='flex items-center justify-between'>
        <AiOutlineTwitter className='m-2 bg-black' />
        <FaTelegram className='m-2 bg-black' />
        <div className='m-2 text-slate-950'>Terms and Conditions</div>
        <div className='m-2 text-slate-950'> Privacy Policy</div>
      </div>
    </div>
  );
};
export default Footer;
