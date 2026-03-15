import React, { useMemo, useState } from "react";
import { IoClose } from "react-icons/io5";
import DefaultAvatar from "../assets/default-avatar.svg";

function AddChatPanel({ isOpen, contacts, conversations, onClose, onSelectContact }) {
  const [searchText, setSearchText] = useState("");

  const availableContacts = useMemo(() => {
    const conversationIds = new Set(conversations.map((item) => item._id));
    return contacts.filter((contact) => !conversationIds.has(contact._id));
  }, [contacts, conversations]);

  const filteredContacts = availableContacts.filter((contact) =>
    contact.username.toLowerCase().includes(searchText.toLowerCase().trim())
  );

  if (!isOpen) {
    return null;
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <aside className="picker-panel" onClick={(event) => event.stopPropagation()}>
        <div className="settings-panel__header">
          <div>
            <h2>Add chat</h2>
            <p>Start a conversation with a contact</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="contact-panel__search contact-panel__search--modal">
          <input
            type="text"
            placeholder="Search contacts"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>

        <div className="picker-panel__list">
          {filteredContacts.map((contact) => (
            <button
              type="button"
              className="picker-contact"
              key={contact._id}
              onClick={() => onSelectContact(contact)}
            >
              <div className="avatar avatar--contact">
                <img src={contact.avatarImage || DefaultAvatar} alt={contact.username} />
              </div>
              <div className="contact-card__body">
                <h3>{contact.username}</h3>
                <p>{contact.about || "Say hi to start chatting"}</p>
              </div>
            </button>
          ))}

          {!filteredContacts.length && (
            <div className="contact-panel__empty">
              <p>No more contacts to add.</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

export default AddChatPanel;
