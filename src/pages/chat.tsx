"use client";

import React, { useEffect, useState } from "react";

import ChatComponent from "../components/chatComponent";
import LeftPanel from "../components/LeftPanel";
import { useDashboardContext } from "../context";
import { useNavigate } from "react-router-dom";

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useDashboardContext();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    if (user === undefined) {
      navigate("/");
    }
    setLoading(false);
  }, []);
  return loading ? null : (
    <main className={"h-screen  bg-zinc-200"}>
      <div className={"flex flex-row h-screen place-content-center"}>
        <LeftPanel />
        <ChatComponent />
      </div>
    </main>
  );
};
export default ChatPage;
