import React from "react";
import Picker, { Emoji } from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useState } from "react";

function ChatInput({handleSendMsg}) {
    const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
    };
    
    const handleEmojiClick = (event, emoji) => {
      console.log(emoji);
    let message = msg;
    message += emoji.emoji;
    setMsg(message);
    };
    
    const sendChat = (event) => {
        event.preventDefault()
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg('')
        }
    }

  return (
    <>
      <div className="text-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
          {showEmojiPicker && <Picker className="picker" onEmojiClick={handleEmojiClick} />}
        </div>
        <form className="input-container" onSubmit={(e)=>sendChat(e)}>
          <input
            type="text"
            placeholder="type your message here"
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
          />
          <button className="submit">
            <IoMdSend />
          </button>
        </form>
      </div>
    </>
  );
}

export default ChatInput;
