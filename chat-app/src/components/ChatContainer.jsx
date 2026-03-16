import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import axios from "axios";
import {
  sendMessageRoute,
  getAllMessageRoute,
  isSocketEnabled,
} from "../utils/Api.Routes";
import DefaultAvatar from "../assets/default-avatar.svg";
import { IoChevronBack } from "react-icons/io5";
import {
  addGuestMessage,
  buildGuestAutoReply,
  getGuestMessages,
} from "../utils/guestMode";

function formatPresence(currentChat, isRecipientOnline) {
  if (!currentChat) {
    return "";
  }

  if (isRecipientOnline) {
    return "Online";
  }

  if (currentChat.settings?.lastSeenVisibility === "nobody") {
    return "Last seen hidden";
  }

  if (!currentChat.lastSeen) {
    return "Offline";
  }

  const lastSeenDate = new Date(currentChat.lastSeen);
  return `Last seen ${lastSeenDate.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function ChatContainer({
  currentChat,
  currentUser,
  socket,
  onBack,
  onMessageSent,
  isRecipientOnline,
  isGuestMode,
}) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const currentChatId = currentChat?._id;
  const currentUserId = currentUser?._id;

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      if (!currentChatId || !currentUserId) return;
      if (isGuestMode) {
        if (isMounted) {
          setMessages(getGuestMessages(currentChatId));
        }
        return;
      }

      try {
        const response = await axios.get(getAllMessageRoute, {
          params: { from: currentUserId, to: currentChatId },
        });
        if (isMounted) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    if (!isSocketEnabled && !isGuestMode) {
      const intervalId = setInterval(fetchMessages, 4000);
      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    }

    return () => {
      isMounted = false;
    };
  }, [currentChatId, currentUserId, isGuestMode]);

  const handleSendMsg = async (msg) => {
    if (!msg.trim()) return;
    try {
      if (isGuestMode) {
        addGuestMessage(currentChatId, { fromSelf: true, message: msg });
        setMessages(getGuestMessages(currentChatId));
        onMessageSent?.(currentChatId);

        window.setTimeout(() => {
          addGuestMessage(currentChatId, buildGuestAutoReply(currentChatId, msg));
          setMessages(getGuestMessages(currentChatId));
          onMessageSent?.(currentChatId);
        }, 800);
        return;
      }

      await axios.post(sendMessageRoute, {
        messages: msg,
        from: currentUserId,
        to: currentChatId,
      });
      if (socket.current) {
        socket.current.emit("send-msg", {
          message: msg,
          from: currentUserId,
          to: currentChatId,
        });
      }
      setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
      onMessageSent?.(currentChatId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const activeSocket = socket.current;
    if (activeSocket) {
      const handleMessageReceive = (payload) => {
        const nextMessage = typeof payload === "string" ? payload : payload?.message;
        const fromUserId = typeof payload === "object" ? payload?.from : currentChat?._id;

        if (fromUserId && currentChat?._id && fromUserId !== currentChat._id) {
          onMessageSent?.(fromUserId);
          return;
        }

        setArrivalMessage({ fromSelf: false, message: nextMessage });
        onMessageSent?.(fromUserId || currentChat?._id);
      };

      activeSocket.on("msg-receive", handleMessageReceive);
      activeSocket.on("msg-recieve", handleMessageReceive);

      return () => {
        activeSocket.off("msg-receive", handleMessageReceive);
        activeSocket.off("msg-recieve", handleMessageReceive);
      };
    }
  }, [socket, currentChat, onMessageSent, isGuestMode]);

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
        <section className="chat-panel">
          <div className="chat-panel__header">
            <div className="chat-panel__title">
              <button type="button" className="chat-back-button" onClick={onBack}>
                <IoChevronBack />
              </button>
              <div className="avatar avatar--chat">
                <img src={currentChat.avatarImage || DefaultAvatar} alt="profile pic" />
              </div>
              <div className="chat-panel__identity">
                <h2>{currentChat.username}</h2>
                <p>{formatPresence(currentChat, isRecipientOnline)}</p>
              </div>
            </div>
          </div>

          <div className="chat-panel__messages">
            {messages.map((msg, index) => (
              <div
                ref={scrollRef}
                className={`chat-message-row ${msg.fromSelf ? "outgoing" : "incoming"}`}
                key={`${msg.fromSelf}-${msg.message}-${index}`}
              >
                <div
                  className={`chat-bubble ${msg.fromSelf ? "sended" : "recieved"}`}
                >
                  <div className="chat-bubble__content">{renderMessageContent(msg)}</div>
                </div>
              </div>
            ))}
          </div>

          <ChatInput handleSendMsg={handleSendMsg} />
        </section>
      )}
    </>
  );
}

export default ChatContainer;
