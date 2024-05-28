import React from "react";
import Robot from "../assets/robot.gif";

function Welcome({ currentUser }) {
  return (
    <>
      <div className="welcome-container">
        <img src={Robot} alt="" />
        <h1>
          Hi,<span>{currentUser.username}</span>
        </h1>
        <h3>please sellect a chat to start messaging</h3>
      </div>
    </>
  );
}

export default Welcome;
