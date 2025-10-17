import React from "react";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import Sidebar from "../../components/Sidebar/Sidebar";

const Chat: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar Section */}
      <div className="w-full sm:block sm:w-1/3 sm:max-w-[456px] min-h-screen">
        <Sidebar />
      </div>

      {/* Chat Window Section */}
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
