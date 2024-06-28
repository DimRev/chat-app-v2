import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import AppHeader from "~/features/layout/components/app-header";

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
      <body className="flex flex-col w-dvw h-dvh">
        <ClerkProvider>
          <TRPCReactProvider>
            <AppHeader />
            {children}
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
