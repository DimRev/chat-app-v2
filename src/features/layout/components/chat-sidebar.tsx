"use client";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";
import { useQueryGetChats } from "~/features/chat/hooks/use-query-get-chats";
import { Loader2 } from "lucide-react";

function ChatSidebar() {
  const { data: permissionChats, isLoading: isChatsLoading } =
    useQueryGetChats();
  if (isChatsLoading)
    return (
      <div className="bg-muted text-muted-foreground">
        <nav className="flex flex-col items-start">
          <div className="flex items-center gap-2 px-2 py-4">
            <span>Loading</span>
            <Loader2 className="animate-spin" />
          </div>
        </nav>
      </div>
    );
  if (!permissionChats)
    return <div className="bg-muted text-muted-foreground">Error</div>;
  return (
    <div className="bg-muted text-muted-foreground">
      <nav className="flex flex-col items-start">
        {permissionChats.map((permissionChat) => (
          <Link
            key={permissionChat.id}
            href={`/chat/group/${permissionChat.chatId}`}
            className={cn(buttonVariants({ variant: "link" }))}
          >
            {permissionChat.chat.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default ChatSidebar;
