import { ChatInterface, Config, MessageInterface } from "../interfaces/chat";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { SystemUserInterface, loginInterface } from "../interfaces/user";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";

export type AppContextType = {
  chats: ChatInterface[] | null;
  user: SystemUserInterface | undefined;
  selectedChat: ChatInterface | null;
  handleSelectChat: (id: string) => void;
  handleOutgoingMessage: (message: ChatInterface) => void;
  handleSendAttachmentFile: (file: File) => Promise<string>;
  login: (username: string, password: string) => void;
  setUser: (newUser: SystemUserInterface | undefined) => void;
};
//const apiUrl = "https://qa.orioncontactcenter.com.ar:8443";
//const { API_URL } = process.env;
const API_URL=process.env.REACT_APP_API_URL;
export const DashboardContext = createContext<AppContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: any) => {
  const [chats, setChats] = useState<ChatInterface[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatInterface | null>(null);
  const [connection, setConnection] = useState<HubConnection | undefined>( undefined);
  const [user, setUser] = useState<SystemUserInterface>();
  const chatsRef = useRef<ChatInterface[]>([]);

  const initConnection = async () => {
    if (connection === undefined) {
      const connectionBuilder = new HubConnectionBuilder()
        .withUrl(`${API_URL}/realtime-chat`)
        .withAutomaticReconnect();
      let [connection] = await Promise.all([connectionBuilder.build()]);
      setConnection(connection);
    }
  };
  useEffect(() => {
    chatsRef.current = [...chats];
    if(chats.length!=0){
      sessionStorage.setItem("chats",JSON.stringify(chats));
    }    
  }, [chats]);
  
  useEffect(() => {
    if (connection !== undefined) {
        connection.onreconnecting(error => {
          console.log("Se está reconectando al servidor SignalR...");
        });

        connection.onreconnected(connectionId => {
          console.log("Reconectado al servidor SignalR.");
        });

        connection.on("ReceiveNewMessage", (data: ChatInterface) => {
          let object = chatsRef.current.find(
            (chat) => chat.user.providerId === data.user.providerId,
          );
          if (object !== undefined) {
            chatsRef.current.forEach((chat) => {
              if (chat.user.providerId === data.user.providerId) {
                var previousChat=chat.messages.find(message=>message.uid===data.messages[0].uid);
                console.log('previousChat',previousChat);
                if(previousChat === undefined){
                  chat.messages = [...chat.messages, ...data.messages];
                }
                previousChat=data.messages[0];
              }
            });
            setChats(chatsRef.current);
          } else {
            data.historical = false;
            chatsRef.current = [...chatsRef.current, data];
            setChats(chatsRef.current);
          }
        });
      connection
        .start()
        .then(() => {
          console.log("Conexión iniciada con el servidor SignalR.");
        }); /*TODO:implementar si se necesita recibir algo previo*/
    }
  }, [connection]);
  useEffect(() => {
    if (connection === undefined) {
      initConnection().then(() => {
        console.log("Conexion Iniciada");
      });
    }
    if(sessionStorage.getItem("user")!=undefined &&user===undefined)
    {
      let userStored:SystemUserInterface=JSON.parse(sessionStorage.getItem("user")!);
      setUser(userStored);
    }
    if(sessionStorage.getItem("chats")!=undefined &&chats.length===0)
    {
      let chats:ChatInterface[]=JSON.parse(sessionStorage.getItem("chats")!);
      setChats(chats);
    }
  }, []);

  const login = (username: string, password: string) => {
    const config: Config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${API_URL}/login`,
      headers: {}, // Initialize headers as an empty object
      data: { username, password },
    };
    axios.request<SystemUserInterface>(config).then((response) => {
        console.log(response.data);
        if(response.status === 200){
            setUser(response.data);
            sessionStorage.setItem("user",JSON.stringify(response.data))
            return true;
        }
    });
  };
  const getHistorical = (userId: number, instanceId: number) => {
    const config: Config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://qa.orioncontactcenter.com.ar:8443/Chat/Historical/${userId}/${instanceId}`,
      headers: {}, // Initialize headers as an empty object
    };

    axios
      .request<MessageInterface[]>(config)
      .then((response) => {
        let chat = chatsRef.current.find((chat) => chat.user.id === userId && chat.user.instanceId === instanceId);
        if (chat !== undefined) {
          chatsRef.current.forEach((chat) => {
            if (chat.user.id === userId && chat.user.instanceId === instanceId) {
              response.data.forEach((newMessage) => {
                let message = chat.messages.find((message) => message.uid === newMessage.uid);
                if (message === undefined)
                  chat.messages.push(newMessage);
              });
              chat.messages.sort((a, b) => a.timestamp - b.timestamp);
            }
          });
          setChats(chatsRef.current);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSelectChat = (id: string) => {
    const chat = chats?.find((chat) => chat.user.providerId === id);
    if (!chat) {
      return;
    }
    if (!chat.historical) {
      getHistorical(chat.user.id, chat.user.instanceId);
    }
    chat.messages.sort();
    setSelectedChat(chat);
  };
  const handleSendAttachmentFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${API_URL}/Attachments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al enviar el archivo:", error);
      return null;
    }
  };
  const handleOutgoingMessage = async (message: ChatInterface) => {
    console.log(message);
    const response = await axios.post(`${API_URL}/Chat/Outgoing`, message);
    if (response.status === 201) {
      console.log(response.data);
    }
  };
  const contextValue: AppContextType = {
    chats,
    user,
    selectedChat,
    handleSelectChat,
    handleOutgoingMessage,
    handleSendAttachmentFile,
    login,
    setUser,
  };
  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
export const useDashboardContext = (): AppContextType => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useAppContext debe usarse dentro de un AppProvider");
  }

  return context;
};
