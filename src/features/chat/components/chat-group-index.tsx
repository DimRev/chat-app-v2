"use client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryGetUserChatById } from "../hooks/use-query-get-chat-by-id";
import ChatInvitationDialog from "./chat-invitation-dialog";
import ChatMembersDialog from "./chat-members-dialog";
import ChatWindow from "./chat-window";

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

  const writePermissions = ["owner", "admin"];
  if (!permissionChat) {
    router.push("/chat");
    return null;
  }
  return (
    <div className="grid grid-rows-9 mx-20 w-full h-full">
      <div className="flex items-center row-span-1 py-4 w-full">
        <h1 className="flex-1 col-span-5 line-clamp-1 font-bold text-xl">
          {permissionChat.chat.name}
        </h1>
        <div className="flex items-center gap-2 col-span-3 h-20">
          {writePermissions.includes(permissionChat.role) && (
            <ChatInvitationDialog chatId={chatId} />
          )}
          <ChatMembersDialog chatId={chatId} />
        </div>
      </div>
      <ChatWindow chatId={chatId} />
    </div>
  );
}

export default ChatGroupIndex;
