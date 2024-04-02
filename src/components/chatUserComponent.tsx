"use client";

import { Avatar, Card } from "@nextui-org/react";
import { useEffect, useState } from "react";

import { UserInterface } from "../interfaces/chat";
import { useDashboardContext } from "../context";

type ChatUserModel = {
  user: UserInterface | null;
  lastMessage?: string;
};
const newMessageAnimation = "animate-pulse font-bold pt-1 transition ease-in-out";
const messageClass = "font-normal pt-1 transition ease-in-out";

const ChatUserComponent: React.FC<ChatUserModel> = ({
  user,
  lastMessage,
}: ChatUserModel) => {

  const [lastMessageAnimation, setLastMessageAnimation] = useState(messageClass);
  const { handleSelectChat, selectedChat } = useDashboardContext();

  const handleClick = (e: any) => {
    handleSelectChat(user!.providerId);
  };

  useEffect(() => {
    setLastMessageAnimation(newMessageAnimation);
    setTimeout(() => {
      setLastMessageAnimation(messageClass);
    }, 2000);
  }, [lastMessage]);

  return (
    <Card isBlurred isPressable shadow="sm" key={user!.providerId} className={"w-full border-none " +
         (user?.providerId === selectedChat?.user.providerId ? "bg-zinc-200" : "bg-zinc-400") + " px-2 py-3 rounded-small" }
         onPress={(e) => handleSelectChat(user!.providerId)} >
      <div className="flex gap-3 items-stretch">
        <Avatar
          alt={user?.name ?? user?.providerId}
          className="flex-shrink-0"
          isBordered
          color="primary"
          size="md"
          src={
            user?.profilePic ??
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          }
        />
        <div className="flex flex-col items-start">
          <span
            className={
              "text-base " +
              (user?.providerId === selectedChat?.user.providerId
                ? "text-primary"
                : "text-primary-300")
            }
          >
            {user?.name ? user.name.slice(0, 20) + "..." : user?.providerId}
          </span>
          <span
            className={
              "text-sm " +
              (user?.providerId === selectedChat?.user.providerId
                ? "text-zinc-900"
                : "text-default-200")
            }
          >
            {lastMessage ? lastMessage.slice(0, 20) + "..." : "No hay mensajes"}
          </span>
        </div>
      </div>
    </Card>
  );
};
export default ChatUserComponent;
