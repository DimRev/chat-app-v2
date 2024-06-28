import { api } from "~/trpc/react";

type Props = {
  chatId: string;
};

export function useQueryGetUserChatById({ chatId }: Props) {
  return api.chat.getUserChatById.useQuery({ chatId });
}
