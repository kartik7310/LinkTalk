import { leaveAllRooms } from "./socket/helper.js";

export const initlizeSocket = async(io:any)=>{
  io.on("connection", async(socket:any) => {
  try {
    const {user} = socket.data;
      console.log("user connected", user.id);
    socket.join(user.id.toString())
    socket.on("disconnect",async()=>{
      leaveAllRooms(socket)
    })
  } catch (error:any) {
    console.log("socket connection error",error);
    socket.emit("internal_error",{error:"Internal server error"})
    
  }
});
}