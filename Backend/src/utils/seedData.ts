import dotenv from "dotenv"
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import User from "../modals/User.js";
import FriendsShip from "../modals/FriendsShip.js";
import Convertation from "../modals/Convertation.js";
import Message from "../modals/Message.js";

import connectionDatabase from "../config/db.js";

async function resetDatabase() {
    try {
        await connectionDatabase();
        await Message.deleteMany({});
        await Convertation.deleteMany({});
        await FriendsShip.deleteMany({});
        await User.deleteMany({});
        await mongoose.disconnect();
    } catch (error) {
        console.error("Error resetting the database:", error);
        await mongoose.disconnect();
    }
}

async function seed() {
    try {
        await resetDatabase();
        await connectionDatabase();

        const usersData = [
            {
                fullName: 'John',
                userName: 'john',
                email: 'test@test.com',
                connectCode: "111111",
                 password:"12345678"
            },
            {
                fullName: 'Bob',
                userName: 'bob',
                email: 'test2@test.com',
                connectCode: "222222",
                password:"1234567"
            }
        ];

        // create users
        const users = [];
      

        for (const data of usersData) {
              const hashPassword = await bcrypt.hash(data.password, 10);
            data.password = hashPassword;
            const user = await User.create(data);
            console.log(`User created ${user.fullName} (${user.id})`);
            users.push(user);
        }

        const [user1, user2] = users;

        // create friendships
        const friendship = await FriendsShip.create({
            requester: user1._id,
            recipient: user2._id,
        })
        console.log(`Friendship created: ${friendship.id}`);

        // create conversation
        const conversation = await Convertation.create({
            participants: [user1._id, user2._id],
            lastMessagePreview: null,
            unreadCounts: {
                [user1.id]: 0,
                [user2.id]: 0,
            }
        })
        console.log(`Conversation created ${conversation.id}`);

        const messages = [];
        for (let i = 0; i < 30; i++) {
            const sender = i % 2 === 0 ? user1 : user2;
            const content = `Message ${i + 1} from ${sender.userName}`;
            const message = await Message.create({
                sender,
                content: content,
                conversation: conversation._id,
            });
            messages.push(message);
        }
        const lastMessage = messages[messages.length - 1];



        conversation.unreadCounts.set(user2._id.toString(), lastMessage.sender.equals(user2._id) ? 0 : 1);
        conversation.unreadCounts.set(user1._id.toString(), lastMessage.sender.equals(user1._id) ? 0 : 1);
        await conversation.save();

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");

    } catch (error) {
        console.error("Error seeding database:", error);
        await mongoose.disconnect();
    }
}

seed();