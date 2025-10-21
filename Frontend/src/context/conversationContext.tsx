import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "../store/authStore";
import { useConversation } from "../hooks/useConversation";


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

const ConversationsContext = createContext<ConversationsContextType | undefined>(undefined);

export function useConversationsContext() {
  const context = useContext(ConversationsContext);
  if (!context) throw new Error("useConversationsContext must be used within ConversationsProvider");
  return context;
}

type ConversationsProviderProps = {
  children: ReactNode;
};

export function ConversationsProvider({ children }: ConversationsProviderProps) {
  const { data, isLoading, isError } = useConversation();
  console.log("Data",data);
  
  
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (data) setConversations(data);
    console.log("conversatin after eff",conversations);
    
  }, [data]);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.friend.username.toLowerCase().includes(searchTerm.toLowerCase())
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
