"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useQueryGetUserChatById } from "../hooks/use-query-get-chat-by-id";
import { Loader2 } from "lucide-react";
import ChatWindow from "./chat-window";
import ChatInvitationDialog from "./chat-invitation-dialog";

type Props = {
  chatId: string;
};

function ChatGroupIndex({ chatId }: Props) {
  const router = useRouter();
  const { data: permissionChat, isLoading: isChatLoading } =
    useQueryGetUserChatById({
      chatId,
    });

  if (isChatLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin size-32" />
      </div>
    );

  if (!permissionChat) {
    router.push("/chat");
    return null;
  }
  return (
    <div className="container">
      <div className="flex justify-between items-center py-4">
        <h1 className="font-bold text-xl">{permissionChat.chat.name}</h1>
        <ChatInvitationDialog />
      </div>

      <ChatWindow chatId={chatId} />
    </div>
  );
}

export default ChatGroupIndex;
