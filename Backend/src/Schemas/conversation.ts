import {z} from "zod";
export const conversationSchema = z.object({
  participants: z.array(z.string().min(1))
    .min(2, "A conversation must have at least two participants")
    .refine(
      (participants) => new Set(participants).size === participants.length,
      { message: "Duplicate participants are not allowed" }
    ),
  lastMessage: z.string().optional(),
  lastMessagePreview: z.object({
    content: z.string().optional(),
    timestamp: z.date().optional(),
  }).optional(),
  unreadCounts: z.record(z.string(), z.number()).optional(),
});
