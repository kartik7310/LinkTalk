import { z } from "zod";

export const friendshipSchema = z.object({
  requester: z.string({
     
  }).nonempty("Requester ID is required").min(1, "Requester ID cannot be empty"),

  recipient: z.string({

  }).min(1, "Recipient ID cannot be empty"),
});
