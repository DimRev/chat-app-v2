import ChatList from "./chat-list";
import NewChatForm from "./new-chat-form";

function ChatIndex() {
  return (
    <div>
      <div className="flex justify-between items-center py-4">
        <h1 className="font-bold text-xl">Chat Groups</h1>
        <NewChatForm />
      </div>
      <ChatList />
    </div>
  );
}

export default ChatIndex;
