
import { Socket } from "socket.io";
import FriendsShip from "../modals/FriendsShip.js"
import { getChatRoom } from "./helper.js";
import User from "../modals/User.js";
import Convertation from "../modals/Convertation.js";
import RedisService from "../redis/redis.js"

export const notifyConversationOnlineStatus  =async(io:any,socket:Socket,online:any)=>{
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

export const conversationRequest = async(io:any,socket:Socket,data:any)=>{
  try {
     const user =socket.data.user
  const userId =  socket.data.userId ;
  const {connectCode} = data;
  const friend = await User.findOne({connectCode});
  if(!friend){
    socket.emit("conversation:request:error",{error:"enable to find request error"});
    return
  }
  if(friend.id.toString()===userId){
    socket.emit("conversation:request:error",{error:"can not add yourself as a friend"});
    return
  }
   const existingFriendship = await FriendsShip.findOne({
            $or: [
                {requester: userId, recipient: friend.id},
                {requester: friend.id, recipient: userId}
            ],
        })

      if (existingFriendship) {
            socket.emit("conversation:request:error", {error: "Friendship already exists"});
            return;
        }
      
        const friendship = await FriendsShip.create({
            requester: userId,
            recipient: friend.id,
        })

          const conversation = await Convertation.create({
            participants: [userId, friend.id.toString()]
        });
        
        socket.join(getChatRoom(userId, friend.id.toString()));

     const [userOnline, friendOnline] = await Promise.all([
    RedisService.isUserOnline(userId.toString()),
    RedisService.isUserOnline(friend.id.toString())
  ]);
         const conversationData = {
            conversationId: conversation._id.toString(),
            lastMessage: null,
            unreadCounts: {
                [userId.toString()]: 0,
                [friend.id.toString()]: 0,
            },
        };

         io.to(userId.toString()).emit('conversation:accept', {
            ...conversationData,
            friend: {
                id: friend.id,
                fullName: friend.fullName,
                username: friend.userName,
                connectCode: friend.connectCode,
                online:friendOnline
            }
        })

         io.to(friend.id.toString()).emit('conversation:accept', {
            ...conversationData,
            friend: {
                id: user.id,
                fullName: user.fullName,
                username: user.username,
                connectCode: user.connectCode,
                online: userOnline
            }
        })
  } catch (error:any) {
     console.error("Error conversation:request", error);
        socket.emit("conversation:request:error", {error: "Error conversation:request"})
  }
}