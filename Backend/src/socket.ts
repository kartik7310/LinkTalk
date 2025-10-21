import { leaveAllRooms } from "./socket/helper.js";
import { notifyConversationOnlineStatus } from "./socket/ocketConversation.js";

export const initlizeSocket = async (io: any) => {
  io.on("connection", async (socket: any) => {
    try {
      const { user } = socket.data;
      console.log("user connected", user.id);
      socket.join(user.id.toString());
      await notifyConversationOnlineStatus(io, socket, true);
      socket.on("disconnect", async () => {
        await notifyConversationOnlineStatus(io, socket, true);
        leaveAllRooms(socket);
      });
    } catch (error: any) {
      console.log("socket connection error", error);
      socket.emit("internal_error", { error: "Internal server error" });
    }
  });
};
