import { api } from "~/trpc/react";

type Props = {
  chatId: string;
};
export function useQueryChatInvitations({ chatId }: Props) {
  return api.invitation.getChatInvitations.useQuery({ chatId });
}
