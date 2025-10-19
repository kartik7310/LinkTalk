import { NextFunction,Request,Response } from "express";
import { CustomError } from "../utils/CustomError.js";
import { ConversationService } from "../services/ConversationService.js";
import { string } from "zod/v4";


class ConversationController {
  static async checkConnectCode(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return next(new CustomError("User ID is required", 401));
      }

      const { connectCode } = req.query;
      if (!connectCode) {
        return next(new CustomError("Connect code is required", 400));
      }

      await ConversationService.checkConnectCode(userId, connectCode.toString());

      return res.status(200).json({
        message: "Connect ID is valid",
      });
    } catch (error) {
      next(error); 
    }
  }

static async getConversation(req:Request,res:Response,next:NextFunction){
    const userId =req.user?.userId;
    if (!userId) {
        return next(new CustomError("User ID is required", 401));
      }
  const data = await ConversationService.getConversations(userId);
  return res.status(200).json(data)
}
}

export default ConversationController;
