"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";
import { useQueryGetChats } from "~/features/chat/hooks/use-query-get-chats";
import { Group, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/features/shared/components/ui/sheet";
import { usePathname } from "next/navigation";

function ChatSidebar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { data: permissionChats, isLoading: isChatsLoading } =
    useQueryGetChats();
  const pathname = usePathname();

  const handleSheetClose = () => {
    setIsSheetOpen(false);
  };

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
      <div
        className={cn(
          " absolute left-5 z-10 md:hidden",
          pathname.includes("/chat/group") ? "top-[82px]" : "bottom-10",
        )}
      >
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="size-10"
              onClick={() => setIsSheetOpen(true)}
            >
              <Group />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-dvw">
            <SheetHeader>
              <SheetTitle>Groups</SheetTitle>
              <SheetDescription>
                <nav className="flex flex-col items-start line-clamp-1">
                  {permissionChats.map((permissionChat) => (
                    <Link
                      key={permissionChat.id}
                      href={`/chat/group/${permissionChat.chatId}`}
                      className={cn(buttonVariants({ variant: "link" }))}
                      onClick={handleSheetClose}
                    >
                      {permissionChat.chat.name}
                    </Link>
                  ))}
                </nav>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default ChatSidebar;
