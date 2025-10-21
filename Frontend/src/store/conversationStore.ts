  import { create } from "zustand";
 import { type Conversation } from "../context/conversationContext";


type ConversationState = {
    selectedConversation: Conversation | null,
    setSelectedConversation: (conversation: Conversation | null) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
    selectedConversation: null,
    setSelectedConversation: (conversation) => set({selectedConversation: conversation})
}))