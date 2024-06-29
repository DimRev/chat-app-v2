"use client";
import React, { useState } from "react";
import { useQueryChatInvitations } from "../hooks/use-query-chat-invitations";
import { env } from "~/env";
import { Button } from "~/features/shared/components/ui/button";
import { Check, Copy, Loader2, X } from "lucide-react";
import { useMutationDeleteInvitation } from "../hooks/use-mutation-delete-invitation";

type Props = {
  chatId: string;
};

function ChatInvitationList({ chatId }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { data: chatInvitations, isLoading: isChatInvitationsLoading } =
    useQueryChatInvitations({ chatId });
  const {
    mutateAsync: deleteInvitation,
    isPending: isDeleteInvitationPending,
  } = useMutationDeleteInvitation();
  const { refetch: refetchChatInvitations } = useQueryChatInvitations({
    chatId,
  });

  async function handleCopy(url: string, id: string) {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 800);
  }
  async function onDeleteInvitation(invId: string) {
    setDeletingId(invId);
    try {
      await deleteInvitation({ chatId, invId });
      await refetchChatInvitations();
    } catch (err) {
      //TODO: handle err
    } finally {
      setDeletingId(null);
    }
  }

  if (isChatInvitationsLoading) return <div>Loading...</div>;
  if (!chatInvitations) return <div>Error!</div>;
  if (chatInvitations.length === 0) return <div>Empty</div>;

  return (
    <div className="space-y-2">
      {chatInvitations.map((chatInvitation) => (
        <div
          key={chatInvitation.id}
          className="items-center gap-2 grid grid-cols-8 p-2 border rounded-md"
        >
          <div className="col-span-2 font-semibold">{chatInvitation.type}</div>
          <div className="col-span-4 bg-muted text-muted-foreground overflow-x-auto">
            <code className="block px-2 p-2 rounded-md whitespace-nowrap">
              {`${env.NEXT_PUBLIC_NEXT_URL}/chat/invitation/${chatInvitation.id}`}
            </code>
          </div>
          <div className="flex justify-between gap-2 col-span-2">
            <Button
              size="icon"
              onClick={() =>
                handleCopy(
                  `${env.NEXT_PUBLIC_NEXT_URL}/chat/invitation/${chatInvitation.id}`,
                  chatInvitation.id,
                )
              }
            >
              {copiedId === chatInvitation.id ? (
                <Check className="animate-ping" />
              ) : (
                <Copy />
              )}
            </Button>
            <Button
              size="icon"
              variant="destructive"
              disabled={
                isDeleteInvitationPending && deletingId === chatInvitation.id
              }
              onClick={() => void onDeleteInvitation(chatInvitation.id)}
            >
              {isDeleteInvitationPending && deletingId === chatInvitation.id ? (
                <Loader2 className="animate-spin" />
              ) : (
                <X />
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatInvitationList;
