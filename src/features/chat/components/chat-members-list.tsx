import React from "react";

type Props = {
  chatId: string;
};

function ChatMembersList({ chatId }: Props) {
  console.log(chatId);
  return <div>ChatMembersList</div>;
}

export default ChatMembersList;
