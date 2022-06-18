import ApiHelper from "@/api";
import { API_URL } from "../Constant";
import type { UpdateNotReadMessageOfRoomRequest } from "../models/Room";

export async function callGetRoomById(roomId: string) {
  const { data } = await ApiHelper.put(`${API_URL.ROOM}/${roomId}`);
  return data;
}

export async function updateNotReadMessageOfRoom(
  request: UpdateNotReadMessageOfRoomRequest
) {
  const { data } = await ApiHelper.put(
    `${API_URL.ROOM}/${request.roomId}/${request.userId}/not-read`,
    { ...request }
  );
  return data;
}
