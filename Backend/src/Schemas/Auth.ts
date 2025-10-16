import { z } from "zod";

//register schema
export const registerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  userName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
 connectCode:z.string().min(6, "connectCode must be at least 6 characters"),
  
});
 export type RegisterInput = z.infer<typeof registerSchema>;


export const loginSchema = z.object({
  email: z.string().min(10,"Email or phone is required"),
  password: z.string().min(6, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;
