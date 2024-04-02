"use client";

import { Avatar, Card, Divider } from "@nextui-org/react";

import ChatUserComponent from "../components/chatUserComponent";
import { useDashboardContext } from "../context";
import { useNavigate } from "react-router-dom";

const LeftPanel = () => {
  const { chats, handleSelectChat, setUser } = useDashboardContext();
  const navigate = useNavigate();
  const logout = (e: any) => {
    e.preventDefault();
    setUser(undefined);
    sessionStorage.removeItem("user");
    navigate("/");
  };
  return (
    <Card className="h-[calc(100vh-2rem)] my-auto mx-3 bg-zinc-300 w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 ">
      <div className="flex gap-3 items-center">
        <Avatar
          isBordered
          size={"lg"}
          color="success"
          src="https://i.pravatar.cc/150?u=a04258114e29026302d"
        />
        <div className="flex flex-col items-start">
          <span className="text-small font-semibold text-primary">
            Facebook Agent
          </span>
          <span className="text-tiny text-zinc-800">Agente Generico</span>
          <p onClick={logout} className={"font-semibold text-xs text-danger"}>
            Salir
          </p>
        </div>
      </div>
      <Divider className="my-4" />
      <p className={"text-lg font-semibold pb-3"}>Chats</p>
      {chats!.length > 0 ? (
        chats!.map((chat) => (
          <ChatUserComponent
            user={chat.user}
            lastMessage={chat.messages[chat.messages.length - 1].text ?? "..."}
            key={chat.user.providerId}
          />
        ))
      ) : (
        <div className="flex items-center h-full align-middle">
          <p className={"font-semibold text-center w-full"}>Sin mensajes...</p>
        </div>
      )}
    </Card>
  );
};
export default LeftPanel;
