"use client";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";
import { useQueryGetChats } from "~/features/chat/hooks/use-query-get-chats";
import { Group, Loader2 } from "lucide-react";

function ChatSidebar() {
  const { data: permissionChats, isLoading: isChatsLoading } =
    useQueryGetChats();
  if (isChatsLoading)
    return (
      <div className="max-md:hidden bg-muted/60 text-muted-foreground">
        <nav className="flex flex-col items-start">
          <div className="flex items-center gap-2 px-2 py-4">
            <span>Loading</span>
            <Loader2 className="animate-spin" />
          </div>
        </nav>
      </div>
    );
  if (!permissionChats)
    return (
      <div className="max-md:hidden bg-muted/60 text-muted-foreground">
        Error
      </div>
    );
  return (
    <>
      {/* Desktop sidebar */}
      <div className="max-md:hidden bg-muted/60 text-muted-foreground">
        <nav className="flex flex-col items-start line-clamp-1">
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
      {/* Mobile sidebar */}
      <div className="top-[82px] left-5 z-10 absolute md:hidden">
        <Button size="icon" className="size-10">
          <Group />
        </Button>
      </div>
    </>
  );
}

export default ChatSidebar;
