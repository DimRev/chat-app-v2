import { type ReactNode } from "react";
import ChatSidebar from "~/features/layout/components/chat-sidebar";

type Props = {
  children: ReactNode;
};

function ChatLayout({ children }: Props) {
  return (
    <main className="grid grid-cols-8 h-full">
      <ChatSidebar />
      {children}
    </main>
  );
}

export default ChatLayout;
