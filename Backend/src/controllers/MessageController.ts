import { Request,Response,NextFunction } from "express";
import { MessageService } from "../services/MessageService.js";

class MessageController {
  static async getMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { conversationId } = req.params;
      const { cursor } = req.query;
      const limit = 4;

      const query: any = { conversation: conversationId };
      if (cursor) query.createdAt = { $lt: new Date(cursor as string) };

      const { messages, nextCursor } = await MessageService.getMessage(query, limit, cursor as string);

      return res.json({
        messages,
        nextCursor,
        hasNext: messages.length === limit,
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default MessageController;