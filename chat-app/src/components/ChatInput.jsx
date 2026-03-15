import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Toggle emoji picker
  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  // Add emoji to message and keep picker open/close logic
  const handleEmojiClick = (emojiData) => {
    setMsg((prevMsg) => prevMsg + emojiData.emoji);
    setShowEmojiPicker(false); // close picker after selection
  };

  // Send message
  const sendChat = (event) => {
    event.preventDefault();
    const trimmedMsg = msg.trim();
    if (trimmedMsg) {
      handleSendMsg(trimmedMsg);
      setMsg(""); // clear input
    }
  };

  return (
    <div className="chat-input-bar">
      <div className="chat-input-bar__emoji">
        <BsEmojiSmileFill onClick={toggleEmojiPicker} />
        {showEmojiPicker && (
          <Picker onEmojiClick={handleEmojiClick} className="picker" />
        )}
      </div>

      <form className="chat-input-bar__form" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type a message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
      </form>
      <button className="chat-input-bar__send" type="button" aria-label="Send message" onClick={sendChat}>
        <IoMdSend />
      </button>
    </div>
  );
}

export default ChatInput;
