"use client";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Skeleton } from "~/features/shared/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { type messages, type users } from "~/server/db/schema";

type Props = {
  message?: typeof messages.$inferSelect & {
    author: typeof users.$inferSelect;
  };
  currUserId?: string;
  isLoading?: boolean;
  dir?: boolean;
};

function ChatMessagePreview({ message, currUserId, isLoading, dir }: Props) {
  // User's message
  if (isLoading ?? !message ?? !currUserId)
    return (
      <div
        className={cn(
          "mb-2 max-w-md overflow-hidden rounded-lg bg-white shadow-md",
          dir
            ? "me-auto ms-5 md:me-5 md:ms-auto"
            : "me-5 ms-auto md:me-auto md:ms-5",
        )}
      >
        <div className="flex justify-between items-center gap-2 bg-muted px-4 py-2 font-bold text-gray-700">
          <div className="flex items-center gap-2">
            <Skeleton className="rounded-full overflow-hidden size-10">
              &nbsp;
            </Skeleton>
            <span className="flex-[6] w-full text-primary">
              <Skeleton className="w-full">&nbsp;</Skeleton>
            </span>
          </div>

          <span className="flex-[3] w-full text-muted-foreground">
            <Skeleton className="w-full">&nbsp;</Skeleton>
          </span>
        </div>
        <div className="flex flex-col gap-1 p-4 w-full text-gray-700">
          <Skeleton className="w-full">&nbsp;</Skeleton>
          <Skeleton className="w-full">&nbsp;</Skeleton>
          <Skeleton className="w-full">&nbsp;</Skeleton>
        </div>
      </div>
    );

  return (
    <div
      className={cn(
        "mb-2 max-w-md overflow-hidden rounded-lg bg-white shadow-md",
        message.authorId !== currUserId
          ? "me-auto ms-5 md:me-5 md:ms-auto"
          : "me-5 ms-auto md:me-auto md:ms-5",
      )}
    >
      <div className="flex justify-between items-center bg-muted px-4 py-2 font-bold text-gray-700">
        <div className="flex items-center gap-2">
          <Avatar className="rounded-full overflow-hidden size-10">
            <AvatarImage src={message.author.imageUrl} />
          </Avatar>
          <span className="text-primary">{message.author.name}</span>
        </div>
        <span className="text-muted-foreground text-xs">
          {message.createdAt.toLocaleString("he-IL", {
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
        </span>
      </div>
      <p className="p-4 text-gray-700 max-md:text-sm">{message.content}</p>
    </div>
  );
}

export default ChatMessagePreview;
