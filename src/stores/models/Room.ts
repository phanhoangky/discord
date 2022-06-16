import type { BaseModel, BaseRequest } from "./BaseModel";

export interface Room extends BaseModel {
  id: string;
  name: string;
  creatorId: string;
  notReadMessages: number;
}

export interface CreateRoomModel extends BaseRequest {
  name: string;
}
