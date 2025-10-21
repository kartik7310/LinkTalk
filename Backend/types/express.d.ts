import { IUser } from "../src/modals/User"

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
