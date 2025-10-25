import User from "../modals/User.js";
import FriendsShip from "../modals/FriendsShip.js";
import { CustomError } from "../utils/CustomError.js";
import Convertation from "../modals/Convertation.js";
import RedisService from "../redis/redis.js"
interface IUser {
  _id: string;
  userName: string;
  fullName: string;
  connectCode: string;
}

interface IFriendshipPopulated {
  _id: string;
  requester: IUser;
  recipient: IUser;
}

export const ConversationService = {
  async checkConnectCode(userId: string, connectCode: string) {
    const friend = await User.findOne({ connectCode });

    if (!friend) {
      throw new CustomError("No user found with this connect code.", 404);
    }

    if (friend.id.toString() === userId.toString()) {
      throw new CustomError("You cannot connect with yourself.", 400);
    }

    const existingFriendShip = await FriendsShip.findOne({
      $or: [
        { requester: userId, recipient: friend.id },
        { recipient: friend.id, requester: userId },
      ],
    });

    if (existingFriendShip) {
      throw new CustomError("Friendship already exists.", 409);
    }

    const newFriendship = await FriendsShip.create({
      requester: userId,
      recipient: friend.id,
     
    });
    return { friend, newFriendship };
  },


 async getConversations(userId:string) {

     //get friendships
    const friendships = await FriendsShip.find({
      $or: [{ requester: userId }, { recipient: userId }],
    })
      .populate([
        { path: "requester", select: "_id fullName userName connectCode" },
        { path: "recipient", select: "_id fullName userName connectCode" },
      ])
      .lean<IFriendshipPopulated []>();

    if (!friendships.length) {
      return ({ data: [] });
    }

    const friendIds = friendships.map((friend) =>
      friend.requester._id.toString() === userId
        ? friend.recipient._id.toString()
        : friend.requester._id.toString()
    );

    const conversations = await Convertation.find({
      participants: { $in: [userId, ...friendIds] },
    });

    const conversationsMap = new Map();
    conversations.forEach((conv) => {
      const friendId = conv.participants.find(
        (p) => p.toString() !== userId
      );
      if (friendId) conversationsMap.set(friendId.toString(), conv);
    });

    const conversationsData:any = await Promise.all(
      friendships.map(async (fs) => {
        const isRequester = fs.requester._id.toString() === userId;
        const friend = isRequester ? fs.recipient : fs.requester;
        const conversation = conversationsMap.get(friend._id.toString());

        return {
          conversationId: conversation?._id || null,
          lastMessage: conversation?.lastMessagePreview || null,
          unreadCounts: conversation?.unreadCounts || {},
          friend: {
            id: friend._id.toString(),
            username: friend.userName,
            fullName: friend.fullName,
            connectCode: friend.connectCode,
            online:await RedisService.isUserOnline(friend._id.toString())
          },
        };
       
      })
    );

    return conversationsData
  } 
}


