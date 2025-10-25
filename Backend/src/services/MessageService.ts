import { number } from "zod/v4";
import Message from "../modals/Message.js"

export const MessageService = {
  async getMessage(query: any, limit: number, cursor?: string) {
    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate("sender", "userName")
      .lean();

    const nextCursor =
      messages.length > 0 ? messages[messages.length - 1].createdAt.toISOString() : null;

    messages = messages.reverse();
    return { messages, nextCursor };
  },
};