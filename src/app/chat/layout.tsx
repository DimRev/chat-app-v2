import { type ReactNode } from "react";
import ChatSidebar from "~/features/layout/components/chat-sidebar";

type Props = {
  children: ReactNode;
};

function ChatLayout({ children }: Props) {
  return (
    <main className="flex h-[calc(100%-52px)]">
      <ChatSidebar />
      {children}
    </main>
  );
}

export default ChatLayout;
