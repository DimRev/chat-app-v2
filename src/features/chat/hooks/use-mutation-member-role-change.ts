import { api } from "~/trpc/react";

export function useMutationMemberRoleChange(chatId: string) {
  const utils = api.useUtils();
  return api.user.memberRoleChange.useMutation({
    onSuccess: () => {
      void utils.user.getChatMembers.invalidate({ chatId });
    },
  });
}
