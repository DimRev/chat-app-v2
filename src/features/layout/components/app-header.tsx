import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button, buttonVariants } from "~/features/shared/components/ui/button";
import { cn } from "~/lib/utils";

function AppHeader() {
  return (
    <header className="bg-muted py-2 text-muted-foreground">
      <div className="container">
        <div className="flex justify-between items-center">
          <div>Logo</div>
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
  );
}

export default AppHeader;
