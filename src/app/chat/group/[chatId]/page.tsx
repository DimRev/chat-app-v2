"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useQueryGetUserChatById } from "~/features/chat/hooks/use-query-get-chat-by-id";

function ChatGroupPage({ params: { chatId } }: { params: { chatId: string } }) {
  const router = useRouter();
  const { data: permissionChat, isLoading: isChatLoading } =
    useQueryGetUserChatById({
      chatId,
    });
  if (isChatLoading) return <main className="col-span-7">Loading...</main>;

  if (!permissionChat) {
    router.push("/chat");
    return null;
  }
  return (
    <main className="col-span-7">
      <div className="container">
        <div>{permissionChat.chat.name}</div>
      </div>
    </main>
  );
}

export default ChatGroupPage;
