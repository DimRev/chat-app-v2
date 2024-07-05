"use client";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "~/features/shared/components/ui/button";
import { Input } from "~/features/shared/components/ui/input";
import supabase from "~/lib/supabase";
import { useMutationSendMessageToChat } from "../hooks/use-mutation-send-message-to-chat";
import { useQueryGetUserChatById } from "../hooks/use-query-get-chat-by-id";
import { useQueryGetMessagesByChatId } from "../hooks/use-query-get-messages-by-chat-id";
import ChatMessagePreview from "./chat-message-preview";
import { SmileIcon } from "lucide-react";

type Props = {
  chatId: string;
};

function ChatWindow({ chatId }: Props) {
  const [content, setContent] = useState("");
  const {
    data: messages,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
  } = useQueryGetMessagesByChatId({ chatId });
  const {
    mutateAsync: sendMessageToChat,
    isPending: isSendMessageToChatPending,
  } = useMutationSendMessageToChat();
  const { data: permissionChat, isLoading: isChatLoading } =
    useQueryGetUserChatById({
      chatId,
    });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat-app-v2_message",
          filter: `chat_id=eq.${chatId}`, // Corrected filter syntax
        },
        () => {
          void refetchMessages();
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channels);
    };
  }, [chatId, refetchMessages]);

  function focusInput() {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  async function handleRefetch() {
    await refetchMessages();
    setContent("");
    focusInput();
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (content.trim() === "") {
      if (inputRef.current) {
        setContent("");
        inputRef.current.focus();
      }
      return;
    }
    await sendMessageToChat(
      { chatId, content },
      {
        onSuccess: () => {
          void handleRefetch();
        },
      },
    );
  };

  if (isMessagesLoading || isChatLoading)
    return (
      <div className="grid grid-rows-10 row-span-7 my-2 px-4 pt-4 border rounded-sm overflow-hidden">
        <div className="row-span-9 overflow-auto">
          <ChatMessagePreview isLoading={true} dir={false} />
          <ChatMessagePreview isLoading={true} dir={true} />
          <ChatMessagePreview isLoading={true} dir={false} />
          <ChatMessagePreview isLoading={true} dir={true} />
        </div>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            onChange={(ev) => setContent(ev.target.value)}
            value={content}
            disabled={isSendMessageToChatPending}
            className="flex-1"
          />
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              type="button"
              disabled
              className="bg-yellow-400 hover:bg-yellow-300 text-black hover:text-zinc-800"
            >
              <SmileIcon />
            </Button>
            <Button disabled type="submit">
              {isSendMessageToChatPending ? "sending..." : "send"}
            </Button>
          </div>
        </form>
      </div>
    );

  if (!messages || !permissionChat) return <div>Error</div>;

  if (messages.length === 0)
    return (
      <div className="grid grid-rows-10 row-span-7 my-2 px-4 pt-4 border rounded-sm overflow-hidden">
        <div className="row-span-9 overflow-auto">No messages yet</div>
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            onChange={(ev) => setContent(ev.target.value)}
            value={content}
            disabled={isSendMessageToChatPending}
            className="flex-1"
          />
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              type="button"
              className="bg-yellow-400 hover:bg-yellow-300 text-black hover:text-zinc-800"
            >
              <SmileIcon />
            </Button>
            <Button disabled={isSendMessageToChatPending} type="submit">
              {isSendMessageToChatPending ? "sending..." : "send"}
            </Button>
          </div>
        </form>
      </div>
    );

  return (
    <div className="grid grid-rows-10 row-span-7 my-2 px-4 pt-4 border rounded-sm overflow-hidden">
      <div className="row-span-9 overflow-auto">
        {messages.map((message) => (
          <ChatMessagePreview
            message={message}
            key={message.id}
            currUserId={permissionChat.userId}
          />
        ))}
      </div>
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <Input
          ref={inputRef}
          onChange={(ev) => setContent(ev.target.value)}
          value={content}
          disabled={isSendMessageToChatPending}
          className="flex-1"
        />
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            type="button"
            className="bg-yellow-400 hover:bg-yellow-300 text-black hover:text-zinc-800"
          >
            <SmileIcon />
          </Button>
          <Button disabled={isSendMessageToChatPending} type="submit">
            {isSendMessageToChatPending ? "sending..." : "send"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;
