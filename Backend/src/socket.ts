import { leaveAllRooms } from "./socket/helper.js";
import { notifyConversationOnlineStatus } from "./socket/ocketConversation.js";
import RedisService from "../src/redis/redis.js"

export const initlizeSocket = async (io: any) => {
  io.on("connection", async (socket: any) => {
    try {
        const { user } = socket.data;
        console.log("user connected", user.id);
        await RedisService.addUserSession(user.id,socket.id)
        socket.join(user.id.toString());
        await notifyConversationOnlineStatus(io, socket, true);
      
      socket.on("disconnect", async () => {

        await RedisService.disconnect()
        const isOnline = await RedisService.isUserOnline(user.id);
        if(!isOnline){
        await notifyConversationOnlineStatus(io, socket, true);
          leaveAllRooms(socket);
        }
      
      });
    } catch (error: any) {
      console.log("socket connection error", error);
      socket.emit("internal_error", { error: "Internal server error" });
    }
  });
};
