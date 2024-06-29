import { DialogTitle } from "@radix-ui/react-dialog";
import React from "react";
import { Button } from "~/features/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/features/shared/components/ui/dialog";

type Props = {
  chatId: string;
};

function ChatMembersDialog({ chatId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Members</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle asChild>
          <h1 className="font-bold text-xl">Chat Members</h1>
        </DialogTitle>
        ...Members go here
      </DialogContent>
    </Dialog>
  );
}

export default ChatMembersDialog;
