import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

function ChatLayout({ children }: Props) {
  return (
    <main className="grid grid-cols-8">
      <div>Sidebar</div>
      {children}
    </main>
  );
}

export default ChatLayout;
