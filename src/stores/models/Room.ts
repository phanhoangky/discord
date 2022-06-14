import type { BaseModel } from "./BaseModel";

export interface Room extends BaseModel {
  id: string;
  name: string;
  notReadMessages: number;
}

export interface CreateRoomModel {
  name: string;
}
