"use client";
import Link from "next/link";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { useTrpcError } from "~/features/shared/hooks/use-trpc-error";
import { cn } from "~/lib/utils";
import { useQueryGetChats } from "../hooks/use-query-get-chats";

function ChatList() {
  const {
    data: permissionChats,
    isLoading: isChatsLoading,
    error: chatsError,
  } = useQueryGetChats();

  const { formattedErrors } = useTrpcError(chatsError);

  if (isChatsLoading)
    return (
      <div className="border-collapse border rounded-sm">
        <div className="grid grid-cols-6 bg-primary py-2 border border-b rounded-t-sm font-bold text-primary-foreground">
          <div className="border-e col-span-2 px-2 truncate">Name</div>
          <div className="border-e col-span-2 px-2 truncate">Description</div>
          <div className="border-e col-span-1 px-2 truncate">Role</div>
          <div className="border-e col-span-1 px-2 truncate">Members</div>
        </div>
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

  if (!permissionChats || formattedErrors)
    return (
      <div>
        <h1>Error!</h1>
        {formattedErrors}
      </div>
    );

  if (permissionChats.length === 0) return <div>Empty</div>;

  return (
    <div className="border-collapse border rounded-sm">
      <div className="grid grid-cols-6 bg-primary py-2 border rounded-t-sm font-bold text-primary-foreground">
        <div className="border-e col-span-2 px-2 truncate">Name</div>
        <div className="border-e col-span-2 px-2 truncate">Description</div>
        <div className="border-e col-span-1 px-2 truncate">Role</div>
        <div className="border-e col-span-1 px-2 truncate">Members</div>
      </div>
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
            <div className="border-e col-span-1 px-2 truncate">
              {permissionChat.role}
            </div>
            <div className="col-span-1 px-2 truncate">
              {permissionChat.userCount ? permissionChat.userCount : "0"}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ChatList;
