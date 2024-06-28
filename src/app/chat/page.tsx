import React from "react";
import ChatIndex from "~/features/chat/components/chat-index";

function ChatPage() {
  return (
    <main className="col-span-7">
      <div className="container">
        <div>
          <ChatIndex />
        </div>
      </div>
    </main>
  );
}

export default ChatPage;
