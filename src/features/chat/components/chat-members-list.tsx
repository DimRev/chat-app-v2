"use client";
import React from "react";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { useQueryGetChatMembers } from "~/features/user/hooks/use-query-get-chat-members";
import { cn } from "~/lib/utils";

type Props = {
  chatId: string;
};

function ChatMembersList({ chatId }: Props) {
  const { data: chatMembers, isLoading: isChatMembersLoading } =
    useQueryGetChatMembers({ chatId });

  if (isChatMembersLoading)
    return (
      <div className="p-2 border rounded-sm">
        {new Array(1).fill(null).map((chatMember, idx) => (
          <div
            key={idx}
            className={cn(
              0 !== idx ? "border-b" : "",
              "grid grid-cols-8 gap-2",
            )}
          >
            <Skeleton className="col-span-8 w-full">&nbsp;</Skeleton>
          </div>
        ))}
      </div>
    );
  if (!chatMembers) return <div>Error</div>;
  if (chatMembers.length === 0) return <div>Empty</div>;

  return (
    <div className="p-2 border rounded-sm">
      {chatMembers.map((chatMember, idx) => (
        <div
          key={chatMember.id}
          className={cn(
            chatMembers.length - 1 !== idx ? "border-b" : "",
            "grid grid-cols-8 gap-2",
          )}
        >
          <div className="border-e col-span-2">{chatMember.user.name}</div>
          <div className="border-e col-span-2">{chatMember.role}</div>
        </div>
      ))}
    </div>
  );
}

export default ChatMembersList;
