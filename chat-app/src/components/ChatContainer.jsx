import React, { useState, useEffect, useRef } from "react";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import axios from "axios";
import { sendMessageRoute, getAllMessageRoute } from "../utils/Api.Routes";
import { v4 as uuidv4 } from "uuid";

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;
      try {
        const response = await axios.get(getAllMessageRoute, {
          params: { from: currentUser._id, to: currentChat._id },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [currentChat, currentUser]);

  const handleSendMsg = async (msg) => {
    if (!msg.trim()) return;
    try {
      await axios.post(sendMessageRoute, {
        message: msg,
        from: currentUser._id,
        to: currentChat._id,
      });
      socket.current.emit("send-msg", {
        message: msg,
        from: currentUser._id,
        to: currentChat._id,
      });
      setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, [socket]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessageContent = (msg) => {
    if (
      typeof msg.message === "string" &&
      (msg.message.startsWith("data:image") || msg.message.match(/\.(jpeg|jpg|png|gif)$/i))
    ) {
      return <img src={msg.message} alt="chat-img" className="chat-image" />;
    }
    return <p>{msg.message}</p>;
  };

  return (
    <>
      {currentChat && (
        <div className="chat-container">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={currentChat.avatarImage} alt="profile pic" />
              </div>
              <div className="username">{currentChat.username}</div>
            </div>
            <Logout />
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((msg) => (
              <div ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${msg.fromSelf ? "sended" : "recieved"}`}
                >
                  <div className="content">{renderMessageContent(msg)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <ChatInput handleSendMsg={handleSendMsg} />
        </div>
      )}
    </>
  );
}

export default ChatContainer;
