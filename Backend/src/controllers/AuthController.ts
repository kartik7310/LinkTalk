  import { Request, Response, NextFunction } from "express";
  import { loginSchema, registerSchema } from "../Schemas/Auth.js";

  import { AuthService } from "../services/AuthService.js";
  import { CustomError } from "../utils/CustomError.js";
  import { generateToken } from "../utils/jwt.js";

  class AuthController {
    static async register(req: Request, res: Response, next: NextFunction) {
      try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
          return next(new CustomError("all fields are required"));
        }

        const data = parsed.data;
       

        const user = await AuthService.registerUser(data);


        res.status(201).json({
          status: "success",
          data: user,
        });
      } catch (error) {
        next(error); 
      }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
      try {
        const parsed = loginSchema.safeParse(req.body);

        if (!parsed.success) {
      
          return next(new CustomError("all fields are required"));
        }

        const data = parsed.data;

        
        const user = await AuthService.loginUser(data);
        const userId = user._id.toString();
        const token = generateToken(userId);

        res.cookie("jwt", token, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV !== "development",
        });

        res.status(201).json({
          status: "success",
          data: user,
          token: token,
        });
      } catch (error) {
        next(error); 
      }
    }
  
    // 
    static async me(req: Request, res: Response, next: NextFunction) {
      try {
      
        const userId = req.user!.userId;
        
        const userData = await AuthService.getUserById(userId);
        
        res.status(200).json({
          success: true,
          message: "User fetched successfully",
          data: { user: userData }
        });
      } catch (error) {
        next(error);
      }
    }
      static async logout(req:Request, res:Response,next:NextFunction) {
          res.cookie("jwt", "", {maxAge: 0});
          res.json({message: "Logged out successfully!"});
      }
  }
  export default AuthController;
