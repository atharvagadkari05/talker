import React from "react";
import "./chat.css";
import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Chat({ socket, username, room }) {
  const [msg, setmsg] = new useState("");
  const [messageList, setMessageList] = useState([]);

  async function sendmessage() {
    if (msg != "") {
      const msgData = {
        author: username,
        roomid: room,
        message: msg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_msg", msgData);
      setMessageList((list) => [...list, msgData]);
      setmsg("");
    }
  }

  useEffect(() => {
    socket.on("recieve_msg", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="Chat-box">
      <div className="chathead"></div>
      <div className="chatbody">
        {messageList.map((messageContent) => {
          return (
            <div
              className="message"
              id={username === messageContent.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{messageContent.time}</p>
                  <p id="author">{messageContent.author}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="footer">
        <TextField
          type="text"
          value={msg}
          placeholder="Hey..."
          onChange={(event) => {
            setmsg(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendmessage();
          }}
          id="standard-basic"
          variant="standard"
        />

        <Button
          onClick={sendmessage}
          variant="contained"
          href="#contained-buttons"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default Chat;
