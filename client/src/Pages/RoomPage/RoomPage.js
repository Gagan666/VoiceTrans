import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MessageList from "./MessageList/MessageList";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import "./RoomPage.css";
import Participants from "./Participants/Participants";
import { useSnackbar } from "notistack";

const RoomPage = () => {
  const { room } = useParams();
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [participants, setParticipants] = useState([]);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err) // onNotAllowedOrFound
  );

  const addAudioElement = (blob) => {
    // const url = URL.createObjectURL(blob);
    // Assuming you have a Blob named 'myBlob'
    blobToBase64(blob)
      .then((base64String) => {
        // Now 'base64String' contains the base64-encoded representation of the Blob
        socket.emit("voice_message", {
          username,
          room,
          audioBlob: base64String,
        });
        // Send 'base64String' to the server or wherever you need it
      })
      .catch((error) => {
        console.error(error);
      });

    // const audio = document.createElement('audio');
    // audio.src = url;
    // audio.controls = true;
    // document.body.appendChild(audio);
  };
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to read the Blob."));
        }
      };

      reader.onerror = () => {
        reject(new Error("Error reading the Blob."));
      };

      reader.readAsDataURL(blob);
    });
  }

  useEffect(() => {
    const usernameParam = new URLSearchParams(window.location.search).get(
      "username"
    );

    if (!usernameParam) {
      // If username is not provided, navigate back to home
      navigate("/");
      return;
    }

    setUsername(usernameParam);

    const newSocket = io.connect("http://localhost:5000");

    newSocket.emit("join", { username: usernameParam, room });

    setSocket(newSocket);

    window.addEventListener("beforeunload", () => {
      newSocket.emit("leave", { username: usernameParam, room });
      newSocket.disconnect();
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        newSocket.emit("leave", { username: usernameParam, room });
        newSocket.disconnect();
      });
      newSocket.emit("leave", { username: usernameParam, room });
      newSocket.disconnect();
    };
  }, [room, navigate]);

  const handleIncomingMessage = (message) => {
    console.log("Received voice message:", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleUserJoined = ({ username, users }) => {
    console.log(username, users);
    enqueueSnackbar(`${username} joined the room`, { autoHideDuration: 1000 });
    setParticipants(users);
  };

  const handleCallEnd = () => {
    navigate("/");
    socket.emit("leave", { username: username, room });
  };

  const handleUserLeft = ({ username, users }) => {
    setParticipants(users);
    enqueueSnackbar(`${username} left the room`, { autoHideDuration: 1000 });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("voice_message", handleIncomingMessage);
    socket.on("user-joined", handleUserJoined);
    socket.on("user-left", handleUserLeft);
    return () => {
      socket.off("voice_message", handleIncomingMessage);
      socket.off("user-joined", handleUserJoined);
      socket.off("user-left", handleUserLeft);
    };
  }, [socket]);
  return (
    <>
      <div className="room-container">
        {/* <h1 className="title">Room:{room}</h1> */}

        <div className="chat-section">
          <div className="header">
            <p className="title">Room : {room}</p>
          </div>
          <div className="section">
            <MessageList username={username} messages={messages} />
          </div>
          <div className="btn-container">
            {participants.length > 1 ? (
              <>
                <AudioRecorder
                  onRecordingComplete={(blob) => addAudioElement(blob)}
                  recorderControls={recorderControls}
                  downloadOnSavePress={false}
                  // downloadFileExtension="mp3"
                  showVisualizer={true}
                />
                <button className="call-end-btn" onClick={handleCallEnd}>
                  <CallEndIcon sx={{ color: "white" }} />
                </button>
              </>
            ) : (
              <div className="title">Waiting for Users to Join...</div>
            )}
          </div>
        </div>
        <Participants participants={participants} />
      </div>
    </>
  );
};

export default RoomPage;
