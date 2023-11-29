import React from "react";
import "./Participants.css";
import { Divider } from "@mui/material";
const Participants = ({ participants }) => {
  return (
    <div className="pat-container">
      <div className="head">
        <h2 className="header-txt">Participants</h2>
      </div>
      <Divider
        variant="fullWidth"
        light
        sx={{ background: "lightgray", borderBottomWidth: 1 }}
      />
      {participants.map((participant) => (
        <div className="pat">
          <div className="pat-icon">{participant[0].toUpperCase()}</div>
          <div className="pat-text">{participant.toUpperCase()}</div>
          <Divider
            variant="fullWidth"
            light
            sx={{ background: "#fff", borderBottomWidth: 1 }}
          />
        </div>
      ))}
    </div>
  );
};

export default Participants;
