export interface ChatInterface {
  historical: boolean;
  messages: MessageInterface[];
  user: UserInterface;
}

export enum Direction {
  Incoming = 0,
  Outgoing = 1,
  Bot = 2,
}

export interface UserInterface {
  id: number;
  name: string;
  profilePic: string;
  providerId: string;
  instanceId: number;
}

export interface MessageInterface {
  uid: string | null;
  type: string;
  threadId: number;
  text: string | null;
  attachments: AttachmentInterface[] | null;
  quickReply: string | null;
  replyTo: string | null;
  timestamp: number;
  direction: Direction;
  operatorId: number;
}

export interface AttachmentInterface {
  type: string;
  contentType: string;
  url: string;
  title: string;
}

export interface Config {
  method: string;
  maxBodyLength: number;
  url: string;
  headers: Record<string, string>; // Use Record for flexible header types
  data?: any | null;
}
