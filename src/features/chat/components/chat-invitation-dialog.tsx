import { Button } from "~/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/features/shared/components/ui/dialog";
import ChatInvitationForm from "./chat-invitation-form";
import ChatInvitationList from "./chat-invitation-list";

type Props = {
  chatId: string;
};

function ChatInvitationDialog({ chatId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Manage Invitations</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle asChild>
          <h1 className="font-bold text-xl">Invitation Links</h1>
        </DialogTitle>
        <ChatInvitationList chatId={chatId} />
        <div>
          <h2 className="font-semibold text-lg">Create new invitation link</h2>
          <ChatInvitationForm chatId={chatId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ChatInvitationDialog;
