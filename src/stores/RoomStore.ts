import type { CreateRoomModel, Room } from "./models/Room";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";

export interface RoomStoreState {
  rooms: Room[];
  showEditModal: boolean;
  showCreateModal: boolean;
  selectedRoom?: Room;
  createRoomModel?: CreateRoomModel;
}

export const useRoomStore = defineStore({
  id: "room-store",
  state: () =>
    ({
      rooms: [],
      showEditModal: false,
      showCreateModal: false,
      selectedRoom: undefined,
      createRoomModel: undefined,
    } as RoomStoreState),
  actions: {
    setRooms(values: Room[]) {
      this.rooms = values;
    },
    setShowEditModal(value: boolean) {
      this.showEditModal = value;
    },
    setShowCreateModal(value: boolean) {
      this.showCreateModal = value;
    },
    setCreateRoomModel(values: any) {
      this.createRoomModel = { ...this.createRoomModel, ...values };
    },
    async fetchRooms() {
      const { data } = await ApiHelper.get(`${API_URL.ROOM}`);
      this.rooms = data;
      if (data.length > 0) {
        this.selectedRoom = data[0];
      }
    },
    async createRoom(values: any) {
      await ApiHelper.post(`${API_URL.ROOM}`, { ...values });
      await this.fetchRooms();
    },
    async editRoom(values: any) {
      await ApiHelper.put(`${API_URL.ROOM}`, values);
      await this.fetchRooms();
    },
    async deleteRoom(id: string) {
      await ApiHelper.delete(`${API_URL.ROOM}/${id}`);
      await this.fetchRooms();
    },
    setSelectedRoom(value: Room) {
      this.selectedRoom = value;
    },
  },
});
