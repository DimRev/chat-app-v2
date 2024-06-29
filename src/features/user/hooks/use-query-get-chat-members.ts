import { api } from "~/trpc/react";

type Props = {
  chatId: string;
};

export function useQueryGetChatMembers({ chatId }: Props) {
  return api.user.getChatMembers.useQuery({ chatId });
}
