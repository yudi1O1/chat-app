import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  allUsersRoute,
  conversationsRoute,
  host,
  isSocketEnabled,
} from "../utils/Api.Routes";
import Contact from "../components/Contact";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import "./pagesStyles.css";
import SettingsPanel from "../components/SettingsPanel";
import AddChatPanel from "../components/AddChatPanel";
import ChatSkeleton from "../components/ChatSkeleton";
import {
  ensureGuestState,
  getGuestContacts,
  getGuestConversations,
} from "../utils/guestMode";

function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [allContacts, setAllContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddChatOpen, setIsAddChatOpen] = useState(false);
  const [isChatDataLoading, setIsChatDataLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
        console.log("false");
      } else {
        const storedUser = await JSON.parse(localStorage.getItem("chat-app-user"));
        if (storedUser?.isGuest) {
          const guestState = ensureGuestState();
          setCurrentUser(guestState.user);
          setAllContacts(guestState.contacts);
          setConversations(guestState.conversations);
        } else {
          setCurrentUser(storedUser);
        }
        console.log("current user loaded");
        setIsLoaded(true);
      }
    };
    fetch();
  }, [navigate]);

  const syncCurrentUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem("chat-app-user", JSON.stringify(user));
  };

  useEffect(() => {
    if (currentUser && isSocketEnabled && !currentUser.isGuest) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);

      socket.current.on("online-users", (userIds) => {
        setOnlineUsers(userIds);
      });

      return () => {
        socket.current?.off("online-users");
        socket.current?.disconnect();
      };
    }

    socket.current = undefined;
    setOnlineUsers([]);
  }, [currentUser]);

  useEffect(() => {
    const fetchChatData = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          if (currentUser.isGuest) {
            setIsChatDataLoading(true);
            setAllContacts(getGuestContacts());
            setConversations(getGuestConversations());
            setIsChatDataLoading(false);
            return;
          }

          try {
            setIsChatDataLoading(true);
            const [contactsResponse, conversationsResponse] = await Promise.all([
              axios.get(`${allUsersRoute}/${currentUser._id}`),
              axios.get(`${conversationsRoute}/${currentUser._id}`),
            ]);
            setAllContacts(contactsResponse.data);
            setConversations(conversationsResponse.data);
          } catch (error) {
            console.error("Failed to load chat data:", error);
          } finally {
            setIsChatDataLoading(false);
          }
        } else {
          navigate("/setavatar");
        }
      }
    };
    fetchChatData();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setIsAddChatOpen(false);
  };

  const handleBackToContacts = () => {
    setCurrentChat(undefined);
  };

  const refreshConversations = async (selectedUserId) => {
    if (!currentUser?._id) {
      return;
    }

    if (currentUser.isGuest) {
      const data = getGuestConversations();
      setConversations(data);

      if (selectedUserId) {
        const updatedCurrentChat =
          data.find((conversation) => conversation._id === selectedUserId) ||
          getGuestContacts().find((contact) => contact._id === selectedUserId);
        if (updatedCurrentChat) {
          setCurrentChat(updatedCurrentChat);
        }
      }
      return;
    }

    try {
      const { data } = await axios.get(`${conversationsRoute}/${currentUser._id}`);
      setConversations(data);

      if (selectedUserId) {
        const updatedCurrentChat =
          data.find((conversation) => conversation._id === selectedUserId) ||
          allContacts.find((contact) => contact._id === selectedUserId);
        if (updatedCurrentChat) {
          setCurrentChat(updatedCurrentChat);
        }
      }
    } catch (error) {
      console.error("Failed to refresh conversations:", error);
    }
  };

  const recentContacts = conversations.map((conversation) => ({
    ...conversation,
    isOnline: onlineUsers.includes(conversation._id),
  })).sort((left, right) => {
    const leftTime = left.updatedAt ? new Date(left.updatedAt).getTime() : 0;
    const rightTime = right.updatedAt ? new Date(right.updatedAt).getTime() : 0;
    return rightTime - leftTime;
  });

  if (!isLoaded || (currentUser?.isAvatarImageSet && isChatDataLoading)) {
    return <ChatSkeleton />;
  }

  ///uiDesign
  return (
    <div className="chat-page-shell">
      <div className={`chat-layout ${currentChat ? "chat-selected" : ""}`}>
        <Contact
          contacts={recentContacts}
          allContacts={allContacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
          currentChat={currentChat}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAddChat={() => setIsAddChatOpen(true)}
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome contacts={recentContacts} currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
            onBack={handleBackToContacts}
            onMessageSent={refreshConversations}
            isRecipientOnline={onlineUsers.includes(currentChat?._id)}
            isGuestMode={Boolean(currentUser?.isGuest)}
          />
        )}
      </div>
      <SettingsPanel
        currentUser={currentUser}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUserUpdated={syncCurrentUser}
      />
      <AddChatPanel
        isOpen={isAddChatOpen}
        contacts={allContacts}
        conversations={conversations}
        onClose={() => setIsAddChatOpen(false)}
        onSelectContact={handleChatChange}
      />
    </div>
  );
}

export default Chat;
