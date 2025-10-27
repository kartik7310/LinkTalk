import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../store/authStore";
import { useConversation } from "../hooks/useConversation";
import { useSocketContext } from "./socketContext";
import { toast } from "sonner";

export type Conversation = {
  conversationId: string;
  friend: User & { online: boolean };
  unreadCounts: Record<string, number>;
  lastMessage: {
    content: string;
    timestamp: Date;
  };
};

type ConversationsContextType = {
  conversations: Conversation[];
  filteredConversations: Conversation[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isLoading: boolean;
  isError: boolean;
};

const ConversationsContext = createContext<
  ConversationsContextType | undefined
>(undefined);

export function useConversationsContext() {
  const context = useContext(ConversationsContext);
  if (!context)
    throw new Error(
      "useConversationsContext must be used within ConversationsProvider"
    );
  return context;
}

type ConversationsProviderProps = {
  children: ReactNode;
};

export function ConversationsProvider({
  children,
}: ConversationsProviderProps) {
  const { data, isLoading, isError } = useConversation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { socket } = useSocketContext();

  // ✅ Initialize conversations from API
  useEffect(() => {
    if (data) setConversations(Array.isArray(data) ? data : []);
  }, [data]);

  // ✅ Handle friend online/offline status
  const handleConversationOnlineStatus = ({
    friendId,
    userName,
    online,
  }: {
    friendId: string;
    userName: string;
    online: boolean;
  }) => {
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.friend._id === friendId) {
          if (conversation.friend.online !== online) {
            toast.info(`${userName} is ${online ? "online" : "offline"}`);
          }
          return {
            ...conversation,
            friend: { ...conversation.friend, online },
          };
        }
        return conversation;
      })
    );
  };

  const handleConversation = (conversation: Conversation) => {
    console.log("conversation:request");
    setConversations((prev: any) => [...prev, conversation]);
    toast.success(`You and ${conversation.friend.userName} are now friends!`);

    // optional reconnect safeguard
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  };

  const handleConversationUpdateUnreadCounts = (conversation: {
    conversationId: string;
    unreadCounts: Record<string, number>;
  }) => {
    console.log("conversation:update-unread-counts", conversation);
    setConversations((prev) =>
      prev.map((c) =>
        c.conversationId === conversation.conversationId
          ? { ...c, unreadCounts: conversation.unreadCounts }
          : c
      )
    );
  };

  const handleConversationError = () =>
    toast.error("Unable to add conversation!");
  const handleErrorConversationMarkAsRead = () =>
    toast.error("Unable to mark conversation as read!");

  const handleConversationUpdate = (
    conversation: Pick<
      Conversation,
      "conversationId" | "lastMessage" | "unreadCounts"
    >
  ) => {
    console.log("conversation:update-conversation", conversation);
    setConversations((prev) =>
      prev.map((c) =>
        c.conversationId === conversation.conversationId
          ? {
              ...c,
              lastMessage: conversation.lastMessage,
              unreadCounts: conversation.unreadCounts,
            }
          : c
      )
    );
  };

  // ✅ NEW: Handle real-time new message updates
  const handleNewMessage = (data: {
    conversationId: string;
    message: { content: string; createdAt: string };
    unreadCounts: Record<string, number>;
  }) => {
    console.log("conversation:new-message received:", data);

    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.conversationId === data.conversationId
          ? {
              ...conversation,
              lastMessage: {
                content: data.message.content,
                timestamp: new Date(data.message.createdAt),
              },
              unreadCounts: data.unreadCounts,
            }
          : conversation
      )
    );
  };

  // ✅ Register all socket listeners
useEffect(() => {
  if (!socket) return;

  socket.on("conversation:online-status", handleConversationOnlineStatus);
  socket.on("conversation:request", handleConversation);
  socket.on("conversation:update-conversation", handleConversationUpdate);
  socket.on("conversation:new-message", handleNewMessage);
  socket.on("conversation:request:error", handleConversationError);
  socket.on("conversation:mark-as-read:error", handleErrorConversationMarkAsRead);
  socket.on("conversation:update-unread-counts", handleConversationUpdateUnreadCounts);

  return () => {
    socket.off("conversation:online-status", handleConversationOnlineStatus);
    socket.off("conversation:request", handleConversation);
    socket.off("conversation:update-conversation", handleConversationUpdate);
    socket.off("conversation:new-message", handleNewMessage);
    socket.off("conversation:request:error", handleConversationError);
    socket.off("conversation:mark-as-read:error", handleErrorConversationMarkAsRead);
    socket.off("conversation:update-unread-counts", handleConversationUpdateUnreadCounts);
  };
}, [socket]);


  const filteredConversations = conversations?.filter((conversation) =>
    conversation.friend.userName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <ConversationsContext.Provider
      value={{
        conversations,
        filteredConversations,
        isError,
        isLoading,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ConversationsContext.Provider>
  );
}
