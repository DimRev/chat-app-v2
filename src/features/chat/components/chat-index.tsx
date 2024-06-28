"use client";
import React from "react";
import { Button } from "~/features/shared/components/ui/button";
import { useMutationAddChat } from "../hooks/use-mutation-add-chat";

function ChatIndex() {
  const { mutateAsync: addChat } = useMutationAddChat();

  async function handleClick() {
    await addChat({ name: "test group" });
  }

  return (
    <div>
      <Button onClick={handleClick}>Add Group</Button>
    </div>
  );
}

export default ChatIndex;
