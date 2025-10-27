import { Send } from "lucide-react";
import { userAuthStore } from "../../store/authStore";
import { useSocketContext } from "../../context/socketContext";
import { useConversationStore } from "../../store/conversationStore";
import { useRef, useState, useEffect } from "react";

const MessageInput: React.FC = () => {
  const { user } = userAuthStore();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversationStore();

  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // ✅ Emit typing event
  const emitTyping = (isTyping: boolean) => {
    if (!socket || !user || !selectedConversation) return;
    socket.emit("conversation:typing", {
      userId: user._id,
      friendId: selectedConversation.friend.id,
      isTyping,
    });
    isTypingRef.current = isTyping;
  };

  if (!selectedConversation) return null;

  // ✅ Handle message send
  const handleSubmitMessage = () => {
    if (!message.trim() || !user || !socket) return;

    socket.emit("conversation:send-message", {
      conversationId: selectedConversation?.conversationId || null,
      friendId: selectedConversation.friend.id,
      content: message.trim(),
    });

    setMessage("");
    if (isTypingRef.current) emitTyping(false);
  };

  // ✅ Handle typing
  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (!isTypingRef.current) emitTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 600);
  };

  // ✅ Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <textarea
          value={message}
          onChange={handleOnChange}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 text-sm bg-gray-100 rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
        />
        <button
          onClick={handleSubmitMessage}
          type="button"
          className="bg-sky-500 text-white rounded-full size-10 flex items-center justify-center hover:bg-sky-600"
        >
          <Send className="size-[16px]" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
