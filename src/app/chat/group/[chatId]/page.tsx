import ChatGroupIndex from "~/features/chat/components/chat-group-index";

function ChatGroupPage({ params: { chatId } }: { params: { chatId: string } }) {
  return (
    <main className="flex justify-center items-center col-span-7 h-full overflow-auto">
      <ChatGroupIndex chatId={chatId} />
    </main>
  );
}

export default ChatGroupPage;
