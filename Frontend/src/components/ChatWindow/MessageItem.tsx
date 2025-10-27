
import type { Message } from "../../services/messageService";
import { userAuthStore } from "../../store/authStore";



const MessageItem: React.FC<Message> = ({
    _id,
    sender,
    content,
    read,
    createdAt
}) => {

    console.log("Sender",sender);
    
    const { user } = userAuthStore();
     console.log("user",user);
     
    const userIsSender = sender?._id?.toString() === user?._id?.toString();
console.log("Comparison:", {
        senderId: sender?._id,
        userId: user?._id,
        userIsSender
    });
    const created = new Date(createdAt);
    const now = new Date();

    const diffInMs = now.getTime() - created.getTime();
    const diffInDays = diffInMs /  (1000 * 60 * 60 * 24);

    const time = created.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    })    

    const date = created.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric"
    })

    const displayTime = diffInDays > 1 ? `${date} ${time}` : time;

    if (userIsSender) {
        return <div className="flex justify-end mb-4">
            <div className="bg-sky-500 text-white p-3 max-w-xs lg:max-w-md rounded-2xl">
                <p className="text-sm">{content}</p>
                <span className="text-xs flex items-center gap-1 text-blue-100 mt-1">{displayTime}</span>
            </div>
        </div>
    }

    return (
  <div className="flex justify-start mb-4">
    <img 
      src="https://avatar.iran.liara.run/public"
      alt={sender.username}
      className="w-8 h-8 rounded-full object-cover mr-2"
    />
    <div className="bg-white p-3 max-w-xs lg:max-w-md rounded-2xl">
      <p className="text-sm">{content}</p>
      <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">{displayTime}</span>
    </div>
  </div>
);

}

export default MessageItem;