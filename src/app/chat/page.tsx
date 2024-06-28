import React from "react";
import ChatIndex from "~/features/chat/components/chat-index";

function ChatPage() {
  return (
    <main className="col-span-7">
      <div className="container">
        <div>
          <h1>Chat Page</h1>
          <ChatIndex />
        </div>
      </div>
    </main>
  );
}

export default ChatPage;
