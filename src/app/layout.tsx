import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import AppHeader from "~/features/layout/components/app-header";
import { Toaster } from "~/features/shared/components/ui/toaster";

export const metadata = {
  title: "Chat App",
  description: "Chat App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ClerkProvider>
          <TRPCReactProvider>
            <main className="relative flex flex-col w-dvw h-dvh overflow-auto">
              <AppHeader />
              {children}
              <Toaster />
            </main>
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
