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
    <div className="text-container">
      {/* Emoji picker */}
      <div className="emoji">
        <BsEmojiSmileFill onClick={toggleEmojiPicker} />
        {showEmojiPicker && (
          <Picker onEmojiClick={handleEmojiClick} className="picker" />
        )}
      </div>

      {/* Single-line input */}
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="type your message here"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="submit" type="submit">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
