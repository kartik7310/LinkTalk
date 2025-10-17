import React from "react";
import { Route, Routes, Navigate } from "react-router";
import Auth from "./pages/Auth/Auth";
import Chat from "./pages/Chat/Chat";
import Home from "./pages/Home";
import { Toaster } from "sonner";
import { GuestRoute, PrivateRoute } from "./pages/AuthGuard";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/chat" element={<Chat />} />
        </Route>

        <Route element={<GuestRoute />}>
               <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster richColors position="top-right" />
    </>
  );
};

export default App;
