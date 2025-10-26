import React from "react";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import Sidebar from "../../components/Sidebar/Sidebar";
import { SocketProvider } from "../../context/socketContext";
import { useConversationStore } from "../../store/conversationStore";

const Chat: React.FC = () => {
  const {selectedConversation} = useConversationStore()
  return (
  
  <SocketProvider>
      <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Section */}
      <div  className={`w-full sm:block sm:w-1/3 sm:max-w-[456px] min-h-screen ${selectedConversation ? 'hidden' : 'sm:block'}`}>
        <Sidebar />
      </div>

      {/* Chat Window Section */}
      <div className={`${selectedConversation ? 'flex' : 'hidden'} sm:flex flex-1 min-h-screen`}>
        <ChatWindow />
      </div>
    </div>
  </SocketProvider>
  );
};

export default Chat;
