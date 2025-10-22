
import FriendsShip from "../modals/FriendsShip.js"
import { getChatRoom } from "./helper.js";

export const notifyConversationOnlineStatus  =async(io:any,socket:any,online:any)=>{
  try {
    const user =socket.data.user
  const userId =  socket.data.userId 
   const friendship = await FriendsShip.find({
    $or:[{requester:userId},{recipient:userId}]
   });
   
   friendship.forEach((friendship)=>{
    const isRequester = friendship.requester.id.toString()===userId.toString();
      const friendId = isRequester ? friendship.recipient._id : friendship.requester._id;
      const room = getChatRoom(friendId.toString(),userId.toString());
      socket.join(room);
        console.log("emit:conversation:online-status");
         io.to(friendId.toString())
                .emit('conversation:online-status', {
                    friendId: userId,
                    username: user.userName,
                    online
                })
   })
  
  } catch (error) {
     console.error("notifyConversationOnlineStatus", error);
  }
}