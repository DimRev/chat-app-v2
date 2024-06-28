import { api } from "~/trpc/react";

export function useQueryGetChats() {
  return api.chat.getUserChats.useQuery({});
}
