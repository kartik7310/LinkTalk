import { z } from "zod";

export const messageSchema = z.object({
  conversation: z.string({
 
  }).min(1, "Conversation ID cannot be empty"),

  sender: z.string({
   
  }).min(1, "Sender ID cannot be empty"),

  content: z.string({
    
  }).trim().min(1, "Message content cannot be empty"),

  read: z.boolean().optional().default(false),
});
