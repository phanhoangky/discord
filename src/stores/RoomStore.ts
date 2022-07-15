import type { CreateRoomModel, KickUserRequest, Room } from "./models/Room";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";
import useUserStore from "./UserStore";
import type { User } from "./models/User";
import useMessageStore from "./MessageStore";
import {
  callGetRoomById,
  callKickUser,
  updateNotReadMessageOfRoom,
} from "./services/RoomStoreServices";

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
    setCreateRoomModel(values) {
      this.createRoomModel = { ...this.createRoomModel, ...values };
    },
    setSelectedRoom(values) {
      // this.selectedRoom = values;
      this.$patch({
        selectedRoom: values,
      });
    },
    async fetchRooms() {
      const userStore = useUserStore();
      const userId = userStore.user?.id;
      const { data } = await ApiHelper.get(`${API_URL.ROOM}/user/${userId}`, {
        params: { isLoading: true },
      });
      this.rooms = data.results;
      // if (data.length > 0) {
      //   this.selectedRoom = data[0];
      // }
      return data;
    },
    async createRoom(values) {
      const request = {
        ...values,
        isLoading: true,
      };
      await ApiHelper.post(`${API_URL.ROOM}`, request);
      await this.fetchRooms();
    },
    async editRoom(values) {
      const request = {
        ...values,
        isLoading: true,
      };
      await ApiHelper.put(`${API_URL.ROOM}`, request);
      const messageStore = useMessageStore();
      messageStore.$patch({
        selectedRoom: {
          ...messageStore.selectedRoom,
          ...values,
        },
      });
      this.$patch({
        selectedRoom: {
          ...this.selectedRoom,
          ...values,
        },
      });
      await this.fetchRooms();
    },
    async fetchRoomById(roomId: string) {
      const data = await callGetRoomById(roomId);
      console.log("[Fetch room by Id]>>>", data);

      this.$patch({
        selectedRoom: data,
      });

      this.$patch({
        rooms: this.rooms.map((r) => {
          if (r.id == data.id) {
            const notRead = data?.roomUser?.MessageRecipients.filter(
              (e) => e.isRead == false
            );
            r.notReadMessages = notRead.length;
          }
          return r;
        }),
      });
      return data;
    },

    async updateNotReadMessageOfRoomByUser(roomId: string) {
      const userStore = useUserStore();
      if (userStore.user) {
        const updatedUser = (await updateNotReadMessageOfRoom({
          roomId,
          userId: userStore.user.id,
          isLoading: false,
        })) as Room;
        this.$patch({
          rooms: this.rooms.map((r) => {
            if (r.id == updatedUser.id) {
              const notRead = updatedUser.roomUsers
                ?.filter(
                  (e) => e.roomId == roomId && e.userId == userStore.user?.id
                )[0]
                .messageRecipients.filter(
                  (mr) => mr.isRead == false && mr.isActive == true
                ).length;
              if (notRead != undefined) {
                r.notReadMessages = notRead;
              }
            }
            return r;
          }),
        });
        return updatedUser;
      }
      return undefined;
    },

    async deleteRoom(id: string) {
      await ApiHelper.delete(`${API_URL.ROOM}/${id}`, {
        params: { isLoading: true },
      });
      await this.fetchRooms();
    },
    async leaveRoom() {
      const roomId = this.selectedRoom?.id;
      await ApiHelper.delete(`${API_URL.ROOM}/leave/${roomId}`, {
        params: { isLoading: true },
      });
      const messageStore = useMessageStore();
      messageStore.$patch({
        selectedRoom: undefined,
        selectedUser: undefined,
      });
      await this.fetchRooms();
      // this.$patch({
      //   rooms: this.rooms.filter((r) => r.id != roomId),
      // });
    },
    async onOtherUserLeaveRoom(user: User, roomId: string) {
      console.log("[On Leave Group >>>]", user, roomId);
      if (this.selectedRoom?.id == roomId) {
        const userStore = useUserStore();
        const isUserInRoom = userStore.users.some((e) => e.id == user.id);
        if (isUserInRoom) {
          const newUsersList = userStore.users.filter((u) => u.id != user.id);
          userStore.$patch({
            users: newUsersList,
          });
        }
      }
    },

    async kickUserFromRoom(user: User, roomId: string) {
      //
      const request: KickUserRequest = {
        roomId,
        userId: user.id,
        isLoading: true,
        isNotify: true,
      };
      const data = await callKickUser(request);
      const userStore = useUserStore();
      await userStore.fetchUsersInRoom({
        isLoading: true,
        isNotify: false,
      });
    },
  },
});
