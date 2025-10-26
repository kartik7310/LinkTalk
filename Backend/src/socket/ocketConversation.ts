
import { Socket } from "socket.io";
import FriendsShip from "../modals/FriendsShip.js"
import { getChatRoom } from "./helper.js";
import User from "../modals/User.js";
import Conversation from "../modals/Convertation.js";
import RedisService from "../redis/redis.js"
import Message from "../modals/Message.js";

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

          const conversation = await Conversation.create({
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

export const conversationMarkAsRead =async(io:any,socket:Socket,data:any)=>{
  try {
    const {conversationId,friendId} = data;

  const userId =  socket.data.userId ;
  const friendship = await FriendsShip.findOne({
    $or:[
      {requester:userId,recipient:friendId},
      {requester:friendId,recipient:userId}
    ]
  })
  if(!friendship){
    socket.emit("conversation:mark:as-read:error",{error:"no friendship found"})
    return
  }
  const conversation = await Conversation.findById(conversationId);
  if(!conversation){
     socket.emit("conversation:mark:as-read:error",{error:"no conversation found"})
    return
  } 
  console.log("cosddsg",conversation);
  await Conversation.findByIdAndUpdate(
  conversation._id,
  { $set: { [`unreadCounts.${userId.toString()}`]: 0 } },
  { new: true } 
);


  const room = getChatRoom(userId.toString(),friendId);
  io.to(room).emit("conversation:update-unread-counts",{
    conversationId:conversation._id.toString(),
    unreadCounts:{
      [userId.toString()]:0,
      [friendId]:conversation.unreadCounts.get(friendId)||0
    }
  });

  } catch (error:any) {
     console.error("Error conversation:request", error);
        socket.emit("conversation:request:error", {error: "Error conversation:request"})
  }
}

export const conversationSendMessage=async(io:any,socket:Socket,data:any)=>{
  try {
 const {conversationId,friendId,content} = data;

  const userId =  socket.data.userId ;
  const user = socket.data
  const friendship = await FriendsShip.findOne({
    $or:[
      {requester:userId,recipient:friendId},
      {requester:friendId,recipient:userId}
    ]
  })
  if(!friendship){
    socket.emit("conversation:send-message:error",{error:"no friendship found"})
    return
  }
  const conversation = await Conversation.findById(conversationId);
  if(!conversation){
     socket.emit("conversation:send-message:error",{error:"no conversation found"})
    return
  } 

  const message = new Message({
  conversationId:conversation.id,
   sender:userId,
   content
  })

  await message.save()
    const currentUnreadCount = conversation.unreadCounts.get(friendId) ||0
    conversation.unreadCounts.set(friendId,currentUnreadCount+1)
    await conversation.save()

    const messageData = {
      _id:message.id,
      sender:{
        _id:userId.toString(),
        userName:user.userName
      },
      content,
      createAt:message.createdAt,
      read:message.read
    }
    const updateConversation = await Conversation.findById(conversationId)
    const room = getChatRoom(userId,friendId)
    io.to(room).emit("conversation:new-message",{
      conversationId:conversation.id,
      message:messageData
    })

    io.to(room).emit("conversation:update-conversation",{
        conversationId:conversation.id,
      lastMessagePreview:updateConversation?.lastMessagePreview,
      unreadCounts:{
      [userId.toString()]:updateConversation?.unreadCounts.get(userId.toString()),
      [friendId]:updateConversation?.unreadCounts.get(friendId)
      }
    })
  } catch (error) {
    console.error("Error sendingMessage:request", error);
        socket.emit("conversation:send-message:error", {error: "onversation:send-message:error"})
  }

}

export const conversationTyping = async(io:any,socket:Socket,data:any)=>{
 try {
  const {friendId,isTyping} = data;
  const userId = socket.data.userId
  if(userId.toString()==friendId) return
  socket.to(friendId ).emit("conversation:update-typing",{
    userId:userId.toString(),
    isTyping
  })
 } catch (error) {
  console.error("Error sendingMessage:request", error);
        socket.emit("conversation:send-message:error", {error: "onversation:send-message:error"})
 }
}

