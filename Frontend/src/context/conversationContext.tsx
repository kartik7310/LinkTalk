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
  console.log("Data", data);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { socket } = useSocketContext();
useEffect(() => {
  if (data) {
    setConversations(data);
  }
}, [data]);

  const handleConverstaionOnlinStatus = ({
    friendId,
    username,
    online,
  }: {
    friendId: string;
    username: string;
    online: boolean;
  }) => {
     setConversations((prev) => {

        return prev.map((conversation) => {
            if (conversation.friend.id === friendId) {
                if (conversation.friend.online != online) {
                    toast.info(`${username} is ${online ? 'online' : 'offline'}`);
                }

                return {...conversation, friend: {...conversation.friend, online}};
            }

            return conversation;
        })
        })
  };
 
  useEffect(() => {
  console.log("Conversations updated:", conversations);
}, [conversations]);

  const handleConversation = (conversation:Conversation)=>{
   console.log("conversation:request");
   setConversations((prev:any)=>{
    return [...prev,conversation];
   })
   
  }

const handleConversationError=()=>toast.error("unable to add conversation!")
  useEffect(() => {
    socket?.on("conversation:online-status", handleConverstaionOnlinStatus);
    socket?.on("conversation:request",handleConversation)
    socket?.on("conversation:request:error",handleConversationError)
    return () => {
      socket?.off("conversation:online-status", handleConverstaionOnlinStatus);
      socket?.off("conversation:request:error",handleConversationError)
    };
  },[socket]);
  const filteredConversations = conversations.filter((conversation) =>
    conversation.friend.username
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
