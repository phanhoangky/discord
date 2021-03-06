import type { BaseGetRequest, BaseModel, BaseRequest } from "./BaseModel";
import type { User } from "./User";

export interface Message extends BaseModel {
  senderId: string;
  sender: User;
  messageContent: string;
  file?: FileType;
  messageRecipients: MessageRecipient[];
  notReadMessages?: number;
}

export interface MessageRecipient extends BaseModel {
  recepientId?: string;
  messageId: string;
  isRead: boolean;
  recepientRoomId?: string;
  roomId?: string;
  userInRoomId?: string;
}

export interface FileType {
  filePath: string;
  fullPath: string;
  type?: string;
  name: string;
  size: number;
}
export interface SendMessageRequest {
  senderId: string;
  messageContent?: string;
  recepientId?: string;
  roomId?: string;
  filePath?: string;
}

export interface FetchMessageRequest extends BaseGetRequest {
  senderId: string;
  recipientId?: string;
  roomId?: string;
}

export interface UpdateMessageRecipientRequest extends BaseRequest {
  id: string;
  messageId: string;
  recipientId?: string;
  recipientRoomId?: string;
  isRead: boolean;
}
