import React from "react";
import Typewriter from "typewriter-effect";
import "./LeftScreen.css";

const LeftScreen = () => {
  return (
    <div className="sub-container-1">
      <div className="title">LingoLink</div>
      <div className="sub-title">
        <Typewriter
          options={{
            strings: [
              "Bridge the gap, connect with anyone, anywhere.",
              "आपकी आवाज़, हमारा अनुवादक, सीमाओं से रहित दुनिया।",
            ],
            cursor: "_",
            autoStart: true,
            loop: true,
          }}
        />
      </div>
      <div></div>
    </div>
  );
};

export default LeftScreen;
