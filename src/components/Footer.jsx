import React from "react";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaTelegram } from "react-icons/fa";
const Footer = () => {
  return (
    <div className='flex items-center justify-center '>
      <div className='flex items-center justify-around'>
        <AiOutlineTwitter className='m-2' />
        <FaTelegram className='m-2' />
        <div className='m-2'>Terms and Conditions</div>
        <div className='m-2'> Privacy Policy</div>
      </div>
    </div>
  );
};
export default Footer;
