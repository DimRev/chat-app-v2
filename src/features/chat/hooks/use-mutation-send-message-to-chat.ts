import { api } from "~/trpc/react";

export function useMutationSendMessageToChat() {
  return api.message.sendMessageToChat.useMutation();
}
