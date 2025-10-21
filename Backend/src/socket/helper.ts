import { Socket } from "socket.io";

export const getChatRoom = (userId1:string, userId2:string) => {
    const sortedIds = [userId1.toString(), userId2.toString()].sort();
    return `chat_${sortedIds[0]}_${sortedIds[1]}`;
}

export const leaveAllRooms = (socket:Socket) => {
    const rooms = Array.from(socket?.rooms ?? []);
    rooms.forEach((room) => {
        if (room.startsWith('chat_')) {
            socket.leave(room);
        }
    })
}