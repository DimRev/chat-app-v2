"use client";
import React from "react";
import { useQueryGetMessagesByChatId } from "../hooks/use-query-get-messages-by-chat-id";

type Props = {
  chatId: string;
};

function ChatWindow({ chatId }: Props) {
  const { data: messages, isLoading: isMessagesLoading } =
    useQueryGetMessagesByChatId({ chatId });

  if (isMessagesLoading) return <div>Loading...</div>;

  if (!messages) return <div>Error</div>;

  if (messages.length === 0) return <div>No messages yet</div>;

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>
          <div className="flex gap-4">
            <span>{message.author.name} -</span>
            <span>{message.author.createdAt.toLocaleDateString()}</span>
          </div>
          <div>{message.content}</div>
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
