import { api } from "~/trpc/react";

export function useMutationAddChat() {
  return api.chat.addChat.useMutation();
}
