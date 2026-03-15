import React from "react";
import Robot from "../assets/robot.gif";

function Welcome({ currentUser }) {
  return (
    <section className="welcome-panel">
      <img src={Robot} alt="" />
      <h1>
        Hi, <span>{currentUser.username}</span>
      </h1>
      <h3>Your recent conversations live on the left</h3>
      <p>Use Add Chat to start something new. Once you send the first message, that contact will appear in your chat list.</p>
    </section>
  );
}

export default Welcome;
