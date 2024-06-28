import Link from "next/link";
import React from "react";
import { buttonVariants } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";

function ChatSidebar() {
  return (
    <div className="bg-muted text-muted-foreground">
      <nav className="flex flex-col items-start">
        <Link href="/chat" className={cn(buttonVariants({ variant: "link" }))}>
          Opt1
        </Link>
        <Link href="/chat" className={cn(buttonVariants({ variant: "link" }))}>
          Opt2
        </Link>
        <Link href="/chat" className={cn(buttonVariants({ variant: "link" }))}>
          Opt3
        </Link>
        <Link href="/chat" className={cn(buttonVariants({ variant: "link" }))}>
          Opt4
        </Link>
      </nav>
    </div>
  );
}

export default ChatSidebar;
