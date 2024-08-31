import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/Api.Routes";
import Contact from "../components/Contact";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
        console.log("false");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        console.log("current user loaded");
        setIsLoaded(true);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    console.log(currentUser);

    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    } else {
      console.log("nahi chal rha");
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchh = async () => {
      if (currentUser) {
        if (currentUser) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          navigate("/setavatar");
        }
      }
    };
    fetchh();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    console.log(chat);
    setCurrentChat(chat);
  };

  ///uiDesign
  return (
    <div className="mainContainer">
      <div className="container">
        <Contact
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome contacts={contacts} currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;
