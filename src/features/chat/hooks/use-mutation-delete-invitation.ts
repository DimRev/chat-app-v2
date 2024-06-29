import { api } from "~/trpc/react";

export function useMutationDeleteInvitation() {
  return api.invitation.deleteInvitation.useMutation();
}
