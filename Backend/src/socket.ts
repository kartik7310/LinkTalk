export const initlizeSocket = async(io:any)=>{
  io.on("connection", async(socket:any) => {
   console.log("user connected",socket.id);
   
});
}