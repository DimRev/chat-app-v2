import { type FormEvent, useRef, useState } from "react";
import { useMutationSendMessageToChat } from "../hooks/use-mutation-send-message-to-chat";
import { useQueryGetMessagesByChatId } from "../hooks/use-query-get-messages-by-chat-id";
import { Input } from "~/features/shared/components/ui/input";
import { Button } from "~/features/shared/components/ui/button";

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
  const inputRef = useRef<HTMLInputElement>(null);

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
    await sendMessageToChat(
      { chatId, content },
      {
        onSuccess: () => {
          void handleRefetch();
        },
      },
    );
  };

  if (isMessagesLoading) return <div>Loading...</div>;

  if (!messages) return <div>Error</div>;

  if (messages.length === 0)
    return (
      <div className="flex-1 grid grid-rows-10 my-2 px-4 pt-4 border rounded-sm">
        <div className="row-span-9">No messages yet</div>
        <form
          onSubmit={onSubmit}
          className="items-center gap-2 grid grid-cols-6"
        >
          <Input
            ref={inputRef}
            onChange={(ev) => setContent(ev.target.value)}
            value={content}
            disabled={isSendMessageToChatPending}
            className="col-span-5"
          />
          <Button disabled={isSendMessageToChatPending} type="submit">
            {isSendMessageToChatPending ? "sending..." : "send"}
          </Button>
        </form>
      </div>
    );

  return (
    <div className="flex-1 grid grid-rows-10 my-2 px-4 pt-4 border rounded-sm">
      <div className="row-span-9">
        {messages.map((message) => (
          <div key={message.id}>
            <div className="flex justify-end gap-4 bg-muted px-1 py-1 border-b text-muted-foreground">
              {message.author.name} -{" "}
              {message.author.createdAt.toLocaleString()}
            </div>
            <div className="p-1">{message.content}</div>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit} className="items-center gap-2 grid grid-cols-6">
        <Input
          ref={inputRef}
          onChange={(ev) => setContent(ev.target.value)}
          value={content}
          disabled={isSendMessageToChatPending}
          className="col-span-5"
        />
        <Button disabled={isSendMessageToChatPending} type="submit">
          {isSendMessageToChatPending ? "sending..." : "send"}
        </Button>
      </form>
    </div>
  );
}

export default ChatWindow;
