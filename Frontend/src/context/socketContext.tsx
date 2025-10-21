import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { userAuthStore } from "../store/authStore";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocketContext must be used within a SocketProvider");
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = userAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return; // ensure user exists

   const socketClient = io("http://localhost:8081", {
  withCredentials: true,
  reconnectionAttempts: 3,
});
    console.log("socker client",socketClient);
    
    setSocket(socketClient);

    socketClient.on("connect", () => {
      console.log("Socket connected:", socketClient.id);
      toast.success("Connected to server!");
    });

    socketClient.on("disconnect", () => {
      toast.warning("Disconnected from socket server");
    });

    return () => {
      socketClient.disconnect();
      setSocket(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
