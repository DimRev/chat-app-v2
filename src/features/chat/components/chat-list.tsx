"use client";
import React from "react";
import { useQueryGetChats } from "../hooks/use-query-get-chats";
import { cn } from "~/lib/utils";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import Link from "next/link";

function ChatList() {
  const { data: permissionChats, isLoading: isChatsLoading } =
    useQueryGetChats();

  if (isChatsLoading)
    return (
      <div className="border-collapse border rounded-sm">
        {new Array(3).fill(null).map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "grid grid-cols-1 px-4 py-2",
              idx !== 2 && "border-b",
            )}
          >
            <Skeleton className="w-full">&nbsp;</Skeleton>
          </div>
        ))}
      </div>
    );

  if (!permissionChats) return <div>Error!</div>;

  if (permissionChats.length === 0) return <div>Empty</div>;

  return (
    <div className="border-collapse border rounded-sm">
      {permissionChats.map((permissionChat, idx) => (
        <Link
          key={permissionChat.id}
          href={`/chat/group/${permissionChat.chat.id}`}
        >
          <div
            className={cn(
              "grid cursor-pointer grid-cols-6 py-2 transition-all duration-300 hover:bg-primary/20",
              permissionChats.length - 1 !== idx && "border-b",
            )}
          >
            <div className="border-e col-span-2 px-2 truncate">
              {permissionChat.chat.name}
            </div>
            <div className="border-e col-span-2 px-2 truncate">
              {permissionChat.chat.description}
            </div>
            <div className="px-2 truncate">{permissionChat.role}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ChatList;
