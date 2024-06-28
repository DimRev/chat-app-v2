import { api } from "~/trpc/react";

type Props = {
  chatId: string;
};

export function useQueryGetMessagesByChatId({ chatId }: Props) {
  return api.message.getMessagesByChatId.useQuery({ chatId });
}
