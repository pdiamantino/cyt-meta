import { AttachmentInterface, ChatInterface, Direction, MessageInterface } from "../interfaces/chat";
import { Button, ButtonGroup, Card, Input } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";

import { Alert, } from "@material-tailwind/react";
import { ScrollShadow } from "@nextui-org/react";
import { useDashboardContext } from "../context";

const getDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${hour}:${minutes} ${day}-${month}-${year}`;
};
const clientMessageClass = "flex flex-row justify-end mr-4";
const clientMessageAlertColor = "bg-light-blue-200 text-light-blue-900";
const operatorMessageClass = "flex justify-start ";
const operatorMessageAlertColor = "bg-deep-purple-900";

const ChatComponent = () => {

  const { selectedChat, handleOutgoingMessage, handleSendAttachmentFile } = useDashboardContext();
  const [textInputValue, setTextInputValue] = useState<string>("");
  const bottomRef = useRef<null | HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (textInputValue !== "") {
      let newMessage: MessageInterface = {
        attachments: null,
        text: textInputValue,
        threadId: selectedChat!.messages[0].threadId,
        timestamp: new Date().getTime(),
        type: "text",
        uid: "",
        quickReply: null,
        replyTo: null,
        direction: Direction.Outgoing,
        operatorId: 1,
      };
      let newChatMessage: ChatInterface = {
        user: selectedChat!.user,
        messages: [newMessage],
        historical: false,
      };
      handleOutgoingMessage(newChatMessage);
      setTextInputValue("");
    }
  };

  const handleDownload = (
    fileUrl: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = getAttachmentName(fileUrl)!;
    link.target = "_blank";
    link.click();
  };

  const getAttachmentName = (fileUrl: string) => {
    const { pathname: fileName } = new URL(fileUrl);
    return fileName.split("/").pop();
  };
  //Files-------
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (!file) console.log("Error al momento de subir Archivo");

    handleSendAttachmentFile(file!).then((attachmentUrl) => {
      let newAttachment: AttachmentInterface = {
        type: "image",
        contentType: "image/jpeg",
        url: attachmentUrl,
        title: textInputValue,
      };
      let newMessage: MessageInterface = {
        attachments: [newAttachment],
        text: "",
        threadId: selectedChat!.messages[0].threadId,
        timestamp: new Date().getTime(),
        type: "attachment",
        uid: "",
        quickReply: null,
        replyTo: null,
        direction: Direction.Outgoing,
        operatorId: 1,
      };
      let newChatMessage: ChatInterface = {
        historical: false,
        messages: [newMessage],
        user: selectedChat!.user,
      };
      handleOutgoingMessage(newChatMessage);
      setTextInputValue("");
    });
  };

  const handleKeyPress=(event:any)=>{

    if(event.key === 'Enter'){
      event.preventDefault();
      handleSendMessage();
    }
  }
  useEffect(() => {
    if (bottomRef && bottomRef.current) {
      bottomRef.current.scrollIntoView({behavior: 'smooth'});
    }
  });

  return (
    <Card className="h-[calc(100vh-2rem)] my-auto mx-3 bg-transparent w-full p-4 shadow-xl shadow-blue-gray-900/5 flex flex-col">
      <ScrollShadow>
        {selectedChat?.messages.map((message) => {
          return (
            <div className={ message.direction === Direction.Outgoing ? clientMessageClass : operatorMessageClass } key={message.uid} ref={bottomRef} >
              <div className="mt-5 max-w-xl flex flex-col justify-content-end">
                <p className="text-left text-gray-600">
                  {message.direction === Direction.Outgoing ? "Facebook Agent" : selectedChat?.user.name }
                </p>
                <Alert className={ message.direction === Direction.Incoming ? clientMessageAlertColor : operatorMessageAlertColor } >
                  {message.attachments?.map((attachment) => {
                    switch (attachment.type) {
                      case "image":
                        return (
                          <>
                            <img
                              className="h-36 w-auto rounded-lg object-cover object-center"
                              src={attachment.url}
                              alt="nature image"
                            />
                            <p>{attachment.title}</p>
                          </>
                        );
                      case "video":
                        return (
                          <>
                            <video className="h-46 w-auto rounded-lg" controls>
                              <source
                                src={attachment.url}
                                type={attachment.contentType}
                              />
                              Your browser does not support the video tag.
                            </video>
                            <p>{attachment.title}</p>
                          </>
                        );
                      default:
                        return (
                          <>
                            <Button
                              onClick={(e) => handleDownload(attachment.url, e)}
                            >
                              Download {getAttachmentName(attachment.url)}
                            </Button>
                            <p>{attachment.title}</p>
                          </>
                        );
                    }
                  })}
                  <p>{message.text}</p>
                </Alert>
                <p className="text-right text-gray-600" autoFocus> {getDate(message.timestamp)} </p>
              </div>
            </div>
          );
        })}
      </ScrollShadow>
      {selectedChat ? (
        <div className="flex flex-row " ref={bottomRef}>
          <Input label="Mensaje" value={textInputValue} onKeyDown={(e) => handleKeyPress(e)} onChange={(e)=>setTextInputValue(e.target.value)} autoFocus />
          <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />
          <ButtonGroup className={"pl-3"}  size="md">
            <Button onClick={handleSendMessage} isIconOnly aria-label="Send">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </Button>
            <Button onClick={handleButtonClick} isIconOnly aria-label="Attachment">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
            </Button>
            <Button isIconOnly aria-label="Icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
            </Button>
          </ButtonGroup>
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
};
export default ChatComponent;
