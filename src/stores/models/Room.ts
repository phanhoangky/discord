import type { BaseModel, BaseRequest } from "./BaseModel";
import type { MessageRecipient } from "./Message";

export interface Room extends BaseModel {
  id: string;
  name: string;
  creatorId: string;
  notReadMessages: number;
  roomUsers?: RoomUser[];
}

export interface CreateRoomModel extends BaseRequest {
  name: string;
}

export interface RoomUser extends BaseModel {
  roomId: string;
  userId: string;
  messageRecipients: MessageRecipient[];
}

export interface UpdateNotReadMessageOfRoomRequest extends BaseRequest {
  roomId: string;
  userId: string;
}

export interface KickUserRequest extends BaseRequest {
  roomId: string;
  userId: string;
}
