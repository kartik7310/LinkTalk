import { Send } from "lucide-react";
import { userAuthStore } from "../../store/authStore";
import { useSocketContext } from "../../context/socketContext";
import { useConversationStore } from "../../store/conversationStore";
import { useRef, useState } from "react";




const MessageInput: React.FC = () => {
  const {user} = userAuthStore();
  const {socket} = useSocketContext();
  const {selectedConversation} = useConversationStore()
  const [message,setMessage] = useState('')

const typingTimeoutRef = useRef<number|null>(null)
const isTypingRef =useRef(false)

const emitTyping = (isTyping:boolean)=>{
    if(!socket ||!user||!selectedConversation) return
    socket.emit("conversation:typing",{
        userId:user.id,
     friend:selectedConversation.friend.id,
     isTyping
    })
    isTypingRef.current = isTyping
}
  if(!selectedConversation) return;
  const handleSubmitMessage=()=>{
   if(message.trim()=="" ||!user ||!socket)return
   socket.emit("conversation-send-message",{
    ConversationId:selectedConversation?.conversationId,
    userId:user.id,
    friendId:selectedConversation.friend.id,
    content:message.trim(),
   })
   setMessage("")
   if(isTypingRef.current){
    emitTyping(false)
   }
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        if (!isTypingRef.current) {
            emitTyping(true);
        }

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            emitTyping(false);
        }, 500)
    }

    return <div className="p-4 border border-gray-200 bg-white">
        <div className="flex items-center">
            <div className="flex-1">
                <textarea 
                value={message}
                onChange={(e:any)=>handleOnChange(e)}
                    placeholder="Type a message..."
                    className="w-full text-sm bg-gray-100 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                    
                />
            </div>

            <div className="ml-3">
                <button
                   onClick={handleSubmitMessage}
                    type="button"
                    className="bg-sky-500 text-white rounded-full size-10 flex items-center justify-center hover:bg-sky-600 cursor-pointer"
                >
                    <Send className="size-[16px]"/>
                </button>
            </div>
        </div>
    </div>
}

export default MessageInput;