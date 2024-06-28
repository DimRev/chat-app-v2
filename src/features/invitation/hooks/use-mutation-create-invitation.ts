import { api } from "~/trpc/react";

export function useMutationCreateInvitation() {
  return api.invitation.createInvitation.useMutation();
}
