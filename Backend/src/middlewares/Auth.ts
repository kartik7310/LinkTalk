  import Jwt from "jsonwebtoken";
  import { CustomError } from "../utils/CustomError.js";
  import { NextFunction, Request, Response } from "express";

  export interface JwtPayload {
    userId: string;
    iat?: number;
    exp?: number;
  }


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

    
      const decoded = Jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

      if (!decoded || !decoded.userId) {
        throw new CustomError("Invalid token payload", 401);
      }

      req.user = decoded
      next();
    } catch (error) {
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
