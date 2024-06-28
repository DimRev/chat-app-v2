import React from "react";
import { Button } from "~/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/features/shared/components/ui/dialog";

function ChatInvitationDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Manage Invitations</Button>
      </DialogTrigger>
      <DialogContent>Invitations Content</DialogContent>
    </Dialog>
  );
}

export default ChatInvitationDialog;
