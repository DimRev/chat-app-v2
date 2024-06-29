import { z } from "zod";

export const newChatInputSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const createInvitationInputSchema = z.object({
  chatId: z.string(),
  type: z.enum(["permanent", "one-time", "time-limited"]),
});
