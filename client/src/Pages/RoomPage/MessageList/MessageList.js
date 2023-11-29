import React, { useEffect } from "react";
import "./MessageList.css";

const Message = ({ message, username }) => {
  return (
    <div
      className={`message-container ${
        message.username === username ? "mine" : "others"
      }`}
    >
      <audio controls>
        <source
          src={`http://localhost:5000/${message.audioUrl}`}
          type="audio/mp3"
        />
        Your browser does not support the audio element.
      </audio>
      <div
        className="name-text"
        style={message.username === username ? { textAlign: "right" } : {}}
      >
        {message.username}
      </div>
      {/* </p> */}
    </div>
  );
};
const MessageList = ({ username, messages }) => {
  return (
    <div className="message-list">
      {messages.map((message, i) => (
        <Message message={message} username={username} key={i} />
      ))}
    </div>
  );
};

export default MessageList;
