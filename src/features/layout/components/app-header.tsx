import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";

function AppHeader() {
  return (
    <>
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
      <div className="top-[82px] right-5 z-10 absolute md:hidden">
        <Button size="icon" className="size-10">
          <Menu />
        </Button>
      </div>
    </>
  );
}

export default AppHeader;
