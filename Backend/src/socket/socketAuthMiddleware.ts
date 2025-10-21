import jwt from "jsonwebtoken";
import cookie from "cookie";
import User, { IUser } from "../modals/User.js";
import { Socket, ExtendedError } from "socket.io";

export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) return next(new Error("No cookies found"));

    const parsed = cookie.parse(cookies);
    const token = parsed.jwt;
    if (!token) return next(new Error("No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      iat: number;
      exp: number;
    };

    const user = await User.findById(decoded.userId) as IUser;
    if (!user) return next(new Error("No user found"));
    console.log("user is middle",user);
    
    socket.data.userId = user.id.toString();
    socket.data.user = user;
    
    

    next();
  } catch (error) {
    console.error("Socket auth error:", error);
    next(new Error("Authentication failed"));
  }
};
