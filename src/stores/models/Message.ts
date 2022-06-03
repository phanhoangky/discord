import type { BaseGetRequest, BaseModel } from "./BaseModel";
import type { User } from "./User";

export interface Message extends BaseModel {
  senderId: string;
  sender: User;
  messageContent: string;
  recepientId?: string;
  roomId?: string;
  messageRecipients: MessageRecipient[];
}

export interface SendMessageRequest {
  senderId: string;
  messageContent: string;
  recepientId?: string;
  roomId?: string;
}

export interface FetchMessageRequest extends BaseGetRequest {
  senderId: string;
  repepientId?: string;
  roomId?: string;
}

export interface MessageRecipient extends BaseModel {
  recepientId?: string;
  messageId: string;
  isRead: boolean;
  recepientRoomId?: string;
}
