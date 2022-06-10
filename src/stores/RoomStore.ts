import type { CreateRoomModel, Room } from "./models/Room";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";
import useUserStore from "./UserStore";

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
    setShowEditModal(value: boolean) {
      this.showEditModal = value;
    },
    setShowCreateModal(value: boolean) {
      this.showCreateModal = value;
    },
    setCreateRoomModel(values: any) {
      this.createRoomModel = { ...this.createRoomModel, ...values };
    },
    setSelectedRoom(values: any) {
      // this.selectedRoom = values;
      this.$patch({
        selectedRoom: values,
      });
    },
    async fetchRooms() {
      const userStore = useUserStore();
      const userId = userStore.user?.id;
      const { data } = await ApiHelper.get(`${API_URL.ROOM}/user/${userId}`);
      this.rooms = data.results;
      // if (data.length > 0) {
      //   this.selectedRoom = data[0];
      // }
      return data;
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
  },
});
