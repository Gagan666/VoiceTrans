import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RightScreen.css";

const RightScreen = () => {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleRoomJoin = () => {
    navigate(`/room/${room}?username=${username}`, {
      state: { username, room },
    });
  };

  return (
    <div className="sub-container-2">
      <>
        <h2 className="heading">Join Room</h2>
        <input
          placeholder="Enter Room"
          className="input"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <input
          placeholder="Enter Your Name"
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="btn join-btn" onClick={handleRoomJoin}>
          Join
        </button>
      </>
      {/* )} */}
    </div>
  );
};

export default RightScreen;
