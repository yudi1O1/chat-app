import React, { useEffect, useState } from "react";
import Logo from "../assets/1chat.png";
import DefaultAvatar from "../assets/default-avatar.svg";
import { BsSearch, BsPlusLg } from "react-icons/bs";
import Logout from "./Logout";

function Contact({
  contacts,
  allContacts,
  currentUser,
  changeChat,
  currentChat,
  onOpenSettings,
  onOpenAddChat,
}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const getAvatarSrc = (avatarImage) => avatarImage || DefaultAvatar;
  const filteredContacts = contacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchText.toLowerCase().trim())
  );

  return (
    <>
      {currentUserName && (
        <aside className="contact-panel">
          <div className="contact-panel__header">
            <div className="brand-mark">
              <img src={Logo} alt="logo" />
              <div>
                <h3>one-chat</h3>
                <p>{contacts.length} recent chat{contacts.length === 1 ? "" : "s"}</p>
              </div>
            </div>
            <div className="contact-panel__actions">
              <button type="button" className="icon-button" onClick={onOpenAddChat}>
                <BsPlusLg />
              </button>
            </div>
          </div>

          <div className="contact-panel__search">
            <BsSearch />
            <input
              type="text"
              placeholder="Search or start a new chat"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>

          <div className="contacts-list">
            {filteredContacts.map((contact, index) => (
              <div
                key={contact._id}
                className={`contact-card ${contact._id === currentChat?._id || index === currentSelected ? "selected" : ""}`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar avatar--contact">
                  <img src={getAvatarSrc(contact.avatarImage)} alt="profile pic" />
                </div>
                <div className="contact-card__body">
                  <h3>{contact.username}</h3>
                  <p>{contact.lastMessage || contact.about || "Tap to open conversation"}</p>
                </div>
                <div className="contact-card__meta">
                  {contact.isOnline ? (
                    <span className="status-pill status-pill--online">Online</span>
                  ) : null}
                </div>
              </div>
            ))}

            {!filteredContacts.length && (
              <div className="contact-panel__empty">
                <p>
                  {allContacts?.length
                    ? "No recent chats match your search."
                    : "Start a new chat to build your conversation list."}
                </p>
              </div>
            )}
          </div>

          <div className="contact-panel__footer">
            <button type="button" className="current-user-card" onClick={onOpenSettings}>
              <div className="avatar avatar--contact">
                <img src={getAvatarSrc(currentUserImage)} alt="img" />
              </div>
              <div className="current-user-card__body">
                <h2>{currentUserName}</h2>
                <p>{currentUser?.about || "Open settings"}</p>
              </div>
            </button>
            <div className="current-user-card__logout">
              <Logout />
            </div>
          </div>
        </aside>
      )}
    </>
  );
}

export default Contact;
