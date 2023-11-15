import React from "react";
import bgIMG from "../assets/img/img_background.jpg";

const Welcome = ({ setShowWelcome }) => {
  return (
    <div class='container '>
      <div class='content'>
        <img class='background_img ' src={bgIMG} alt='bacground' />

        <span class='frame text_1'>
          Your assetts,
          <br />
          our priority,
        </span>

        <p class='frame text_3'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          <br />
          <br />
          incidunt minima fuga cupiditate, tempora aut tenetur cum molestias.
        </p>

        <span class='frame text_4'>
          <div>A</div>
          Lake
        </span>
        <span class='frame text_5'>Oem oem oem</span>

        <div class='links_div'>
          <div
            class='links link_1'
            onClick={() => setShowWelcome(false)}
            target='_blank'
            rel='noopener noreferrer'>
            Lock
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
