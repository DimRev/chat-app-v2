"use client";
import React, { useState } from "react";
import { useMutationCreateInvitation } from "~/features/invitation/hooks/use-mutation-create-invitation";
import { Dialog } from "~/features/shared/components/ui/dialog";

function ChatInvitationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    mutateAsync: createInvitation,
    isPending: isCreateInvitationPending,
  } = useMutationCreateInvitation();

  return <div>Invitation form</div>;
}

export default ChatInvitationForm;
