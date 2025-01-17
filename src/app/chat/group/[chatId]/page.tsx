import ChatGroupIndex from "~/features/chat/components/chat-group-index";

function ChatGroupPage({ params: { chatId } }: { params: { chatId: string } }) {
  return (
    <main className="flex justify-center items-center px-5 w-full">
      <ChatGroupIndex chatId={chatId} />
    </main>
  );
}

export default ChatGroupPage;
