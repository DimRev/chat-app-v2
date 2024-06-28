import ChatGroupIndex from "~/features/chat/components/chat-group-index";

function ChatGroupPage({ params: { chatId } }: { params: { chatId: string } }) {
  return (
    <main className="col-span-7">
      <ChatGroupIndex chatId={chatId} />
    </main>
  );
}

export default ChatGroupPage;
