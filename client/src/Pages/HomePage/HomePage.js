import React from "react";
import LeftScreen from "./LeftScreen/LeftScreen";
import RightScreen from "./RightScreen/RightScreen";
import "./HomePage.css";
const HomePage = () => {
  return (
    <div className="container">
      <LeftScreen />
      <RightScreen />
    </div>
  );
};

export default HomePage;
