import { z } from "zod";

export const messageSchema = z.object({
  conversation: z.string({
    required_error: "Conversation ID is required",
  }).min(1, "Conversation ID cannot be empty"),

  sender: z.string({
    required_error: "Sender ID is required",
  }).min(1, "Sender ID cannot be empty"),

  content: z.string({
    required_error: "Message content is required",
  }).trim().min(1, "Message content cannot be empty"),

  read: z.boolean().optional().default(false),
});
