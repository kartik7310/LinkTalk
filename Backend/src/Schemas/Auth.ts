import { z } from "zod";

//register schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10).max(15),
  address: z.string().min(5, "Address must be valid"),
  
});
export type RegisterInput = z.infer<typeof registerSchema>;

//login schema
export const loginSchema = z.object({
  email: z.string().min(10,"Email or phone is required"),
  password: z.string().min(6, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;
