"use client";
import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/features/shared/components/ui/sheet";
import { cn } from "~/lib/utils";
import { usePathname } from "next/navigation";

function AppHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const pathname = usePathname();

  const handleSheetClose = () => {
    setIsSheetOpen(false);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="max-md:hidden bg-muted/60 py-2 text-muted-foreground">
        <div className="container">
          <div className="flex justify-between items-center">
            <div className="line-clamp-1 font-bold text-2xl text-primary">
              Chat App
            </div>
            <nav className="flex">
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "link" }), "")}
              >
                Home
              </Link>
              <Link
                href="/chat"
                className={cn(buttonVariants({ variant: "link" }), "")}
              >
                Chat
              </Link>
              <Link
                href="/about"
                className={cn(buttonVariants({ variant: "link" }), "")}
              >
                About
              </Link>
              <SignedOut>
                <SignInButton>
                  <Button>Sign in</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </nav>
          </div>
        </div>
      </header>
      {/* Mobile Header */}
      <div
        className={cn(
          "absolute right-5 z-10 md:hidden",
          pathname.includes("/chat/group") ? "top-[82px] " : "bottom-10",
        )}
      >
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="size-10"
              onClick={() => setIsSheetOpen(true)}
            >
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-dvw">
            <SheetHeader>
              <SheetTitle asChild>
                <div className="line-clamp-1 font-bold text-2xl text-primary">
                  Chat App
                </div>
              </SheetTitle>
              <SheetDescription asChild>
                <div className="flex flex-col justify-between">
                  <nav className="flex flex-col">
                    <SignedOut>
                      <SignInButton>
                        <Button onClick={handleSheetClose}>Sign in</Button>
                      </SignInButton>
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                    <Link
                      href="/"
                      className={cn(buttonVariants({ variant: "link" }), "")}
                      onClick={handleSheetClose}
                    >
                      Home
                    </Link>
                    <Link
                      href="/chat"
                      className={cn(buttonVariants({ variant: "link" }), "")}
                      onClick={handleSheetClose}
                    >
                      Chat
                    </Link>
                    <Link
                      href="/about"
                      className={cn(buttonVariants({ variant: "link" }), "")}
                      onClick={handleSheetClose}
                    >
                      About
                    </Link>
                  </nav>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export default AppHeader;
