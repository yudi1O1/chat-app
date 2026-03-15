import React from "react";

function ChatSkeleton() {
  return (
    <div className="chat-page-shell">
      <div className="chat-layout chat-layout--loading">
        <aside className="contact-panel shimmer-panel">
          <div className="shimmer-block shimmer-block--header" />
          <div className="shimmer-block shimmer-block--search" />
          <div className="shimmer-list">
            {Array.from({ length: 6 }).map((_, index) => (
              <div className="shimmer-contact" key={index}>
                <div className="shimmer-avatar shimmer" />
                <div className="shimmer-contact__body">
                  <div className="shimmer-line shimmer shimmer-line--title" />
                  <div className="shimmer-line shimmer shimmer-line--subtitle" />
                </div>
              </div>
            ))}
          </div>
          <div className="shimmer-block shimmer-block--footer" />
        </aside>

        <section className="chat-panel shimmer-panel">
          <div className="shimmer-block shimmer-block--chatHeader" />
          <div className="shimmer-messages">
            <div className="shimmer-bubble shimmer shimmer-bubble--incoming" />
            <div className="shimmer-bubble shimmer shimmer-bubble--outgoing" />
            <div className="shimmer-bubble shimmer shimmer-bubble--incoming" />
            <div className="shimmer-bubble shimmer shimmer-bubble--outgoing" />
          </div>
          <div className="shimmer-block shimmer-block--input" />
        </section>
      </div>
    </div>
  );
}

export default ChatSkeleton;
