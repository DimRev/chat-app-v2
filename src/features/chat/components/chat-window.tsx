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
import { useSession } from "@clerk/nextjs";
import { useToast } from "~/features/shared/components/ui/use-toast";

type Props = {
  chatId: string;
};

function ChatWindow({ chatId }: Props) {
  const [content, setContent] = useState("");
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [isUserSubmitted, setIsUserSubmitted] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { session } = useSession();
  const { toast } = useToast();
  const {
    data: messages,
    isLoading: isMessagesLoading,
    refetch: refetchMessages,
    isSuccess,
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Supabase websocket listening to update on messages on given chatroom
   */
  useEffect(() => {
    // Subscribe to message received channel
    const messageReceivedChannel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat-app-v2_message",
          filter: `chat_id=eq.${chatId}`,
        },
        () => {
          void refetchMessages();
        },
      )
      .subscribe();

    // Subscribe to user join channel
    const userJoinChannel = supabase.channel(`user-join-${chatId}`);

    void userJoinChannel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        void userJoinChannel.send({
          type: "broadcast",
          event: "user-joined",
          userName: session?.user.username,
        });
      }
    });

    // Listen for user-joined event
    const userJoinedListener = supabase
      .channel(`user-join-${chatId}`)
      .on("broadcast", { event: "user-joined" }, (payload) => {
        toast({
          title: "Member joined",
          description: `${payload.userName} joined the chat`,
          variant: "memberJoined",
        });
      })
      .on("broadcast", { event: "user-left" }, (payload) => {
        toast({
          title: "Member left",
          description: `${payload.userName} left the chat`,
          variant: "memberLeft",
        });
      });

    return () => {
      // Send user left event to channel close
      if (userJoinChannel) {
        void userJoinChannel.send({
          type: "broadcast",
          event: "user-left",
          userName: session?.user.username,
        });
      }

      // Clean up subscriptions on component unmount
      void supabase.removeChannel(messageReceivedChannel);
      void supabase.removeChannel(userJoinChannel);
      void supabase.removeChannel(userJoinedListener);
    };
  }, [chatId, refetchMessages]);

  /**
   * Create listener to message window scroll, and update AtBottom state
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 50);
    };

    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  /**
   * Scroll behavior:
   * - User submit message: Scroll down
   * - User at the bottom of the scroll bar, scroll down when a message is coming
   * - Mount Scroll down
   *
   * If another user sent a message while the user isn't at the bottom the user won't scroll down
   */
  useEffect(() => {
    if (messages && messagesContainerRef.current && messagesEndRef.current) {
      if (isFirstMount || isUserSubmitted) {
        messagesEndRef.current.scrollIntoView({ behavior: "instant" });
        setIsFirstMount(false);
      } else if (isUserSubmitted) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        setIsUserSubmitted(false);
      } else if (isAtBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isFirstMount, isSuccess, isAtBottom]);

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
    setIsUserSubmitted(true);
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
      <div className="grid grid-rows-10 row-span-7 my-2 px-4 pt-4 border rounded-sm w-full overflow-hidden">
        <div
          className="row-span-9 w-full overflow-auto"
          ref={messagesContainerRef}
        >
          <ChatMessagePreview isLoading={true} dir={false} />
          <ChatMessagePreview isLoading={true} dir={true} />
          <ChatMessagePreview isLoading={true} dir={false} />
          <ChatMessagePreview isLoading={true} dir={true} />
          <div ref={messagesEndRef} />
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
      <div className="grid grid-rows-10 row-span-7 my-2 px-4 pt-4 border rounded-sm w-full overflow-hidden">
        <div
          className="row-span-9 w-full overflow-auto"
          ref={messagesContainerRef}
        >
          No messages yet
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

  return (
    <div className="grid grid-rows-10 row-span-7 my-2 px-4 pt-4 border rounded-sm w-full overflow-hidden">
      <div
        className="row-span-9 w-full overflow-auto"
        ref={messagesContainerRef}
      >
        {messages.map((message) => (
          <ChatMessagePreview
            message={message}
            key={message.id}
            currUserId={permissionChat.userId}
          />
        ))}
        <div ref={messagesEndRef}></div>
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
