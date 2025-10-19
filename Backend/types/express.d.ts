import { User } from "../models/user.model"; // or wherever your User type is

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
