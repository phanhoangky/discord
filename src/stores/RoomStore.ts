import type { Room } from "./models/Room";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";

export interface RoomStoreState {
  rooms: Room[];
}

export const useRoomStore = defineStore({
  id: "room-store",
  state: () =>
    ({
      rooms: [],
    } as RoomStoreState),
  actions: {
    setRooms(values: Room[]) {
      this.rooms = values;
    },
    async fetchRooms() {
      const { data } = await ApiHelper.get(`${API_URL.ROOM}`);
      this.rooms = data;
    },
    async createRoom(values: any) {
      await ApiHelper.post(`${API_URL.ROOM}`, { ...values });
      await this.fetchRooms();
    },
  },
});
