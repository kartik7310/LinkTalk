import Jwt from "jsonwebtoken";
import { CustomError } from "../utils/CustomError.js";
import { NextFunction, Request, Response } from "express";

// JWT payload structure
export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

async function auth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.jwt ||
      (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);

    if (!token) {
      throw new CustomError("Access token is required", 401);
    }

    // Verify token
    const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
 

    if (!decoded || !decoded.userId) {
      throw new CustomError("Invalid token payload", 401);
    }

    // Attach userId to request object
    req.user = { userId: decoded.userId };


    next();
  } catch (error: any) {
    if (error instanceof Jwt.TokenExpiredError) {
      return next(new CustomError("Token expired", 401));
    }
    if (error instanceof Jwt.JsonWebTokenError) {
      return next(new CustomError("Invalid token", 401));
    }
    next(error);
  }
}

export default auth;
