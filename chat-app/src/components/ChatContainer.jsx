import React, { useState, useEffect ,useRef} from "react";
import Logout from "./Logout";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import axios from "axios";
import { sendMessageRoute, getAllMessageRoute } from "../utils/Api.Routes";
import { io } from "socket.io-client";

function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef()

  // useEffect(() => {
  //   let response
  //   const fetch = async () => {

  //   console.log(currentUser._id,currentChat._id,);
  //     response = await axios.get(getAllMessageRoute, {
  //       from: currentUser._id,
  //       to: currentChat._id,
  //     });
  //     console.log(response);
  //   };
  //   fetch();
  //   // setMessages(response.data);
  // }, [currentChat]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        console.log(currentUser._id, currentChat._id);
        const response = await axios.get(getAllMessageRoute, {
          params: {
            from: currentUser._id,
            to: currentChat._id,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);


  async function handleSendMsg(msg) {
    await axios.post(sendMessageRoute, {
      messages: msg,
      from: currentUser._id,
      to: currentChat._id,
    });
    // socket.current.emit("send-msg", {
    //   messages: msg,
    //   from: currentUser._id,
    //   to: currentChat._id,
    // });
    // const msgs = [...messages]
    // msg.push({ fromSelf: true, messsage: msg })
    // setMessages(msgs); 
    
                 
  
  };

  // useEffect(() => {
 
  //   if (socket.current) {
    
  //     socket.current.on("msg-recieve", (msg) => {
  //       setArrivalMessage({ fromSelf: false, message: msg });
  //     });
  //   }
  // }, []);  


  // useEffect(() => {
  //   arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  // }, [arrivalMessage]);

  // useEffect(() => {
  //   scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);
  return (
    <>
      {currentChat && (
        <>
          <div className="chat-container">
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                  <img
                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                    alt="profile pic"
                  />
                </div>
                <div className="username">{currentChat.username}</div>
              </div>
              <Logout />
            </div>

            <div className="chat-messages">
              {messages.map((msg) => {
                return (
                  <div>
                    <div
                      className={`message ${
                        msg.fromSelf ? " sended" : "recieved"
                      }`}
                    >
                      <div className="content">
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
          </div>
        </>
      )}
    </>
  );
}

export default ChatContainer;
