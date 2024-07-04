"use client";
import React from "react";
import { Button } from "~/features/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/features/shared/components/ui/select";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { useQueryGetChatMembers } from "~/features/user/hooks/use-query-get-chat-members";
import { cn } from "~/lib/utils";
import { useMutationMemberRoleChange } from "../hooks/use-mutation-member-role-change";
import { useQueryGetUserChatById } from "../hooks/use-query-get-chat-by-id";

type Props = {
  chatId: string;
};

function ChatMembersList({ chatId }: Props) {
  const {
    data: chatMembers,
    isLoading: isChatMembersLoading,
    isRefetching,
  } = useQueryGetChatMembers({ chatId });
  const {
    mutateAsync: MemberRoleChange,
    isPending: isMemberRoleChangePending,
  } = useMutationMemberRoleChange(chatId);
  const { data: permissionChat, isLoading: isChatLoading } =
    useQueryGetUserChatById({
      chatId,
    });

  async function handleRoleChange(role: string, userChatPermissionId: string) {
    if (!["admin", "elevated", "member"].includes(role)) {
      return;
    }
    const validRole = role as "admin" | "elevated" | "member";
    void MemberRoleChange({ chatId, role: validRole, userChatPermissionId });
  }

  if (isChatMembersLoading || isChatLoading)
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
  if (!chatMembers || !permissionChat) return <div>Error</div>;
  if (chatMembers.length === 0) return <div>Empty</div>;

  return (
    <div className="p-2 border rounded-sm">
      {chatMembers.map((chatMember, idx) => (
        <div
          key={chatMember.id}
          className={cn(
            chatMembers.length - 1 !== idx ? "border-b" : "",
            "grid grid-cols-8 items-center gap-2 py-2",
          )}
        >
          <div className="border-e col-span-2 px-1">{chatMember.user.name}</div>
          <div className="border-e col-span-3 px-1">
            {["owner", "admin"].includes(permissionChat.role) ? (
              chatMember.role !== "owner" ? (
                <Select
                  value={chatMember.role}
                  onValueChange={(value) =>
                    handleRoleChange(value, chatMember.id)
                  }
                  disabled={isMemberRoleChangePending || isRefetching}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="elevated">Elevated</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span>Owner</span>
              )
            ) : (
              <span>{chatMember.role}</span>
            )}
          </div>
          <div className="flex gap-2 col-span-3 px-1">
            {["owner", "admin"].includes(permissionChat.role) ? (
              <Button variant="destructive">Remove</Button>
            ) : (
              <></>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatMembersList;
