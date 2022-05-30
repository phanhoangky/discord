import useUserStore from "@/stores/UserStore";
import type {
  FetchMessageRequest,
  Message,
  SendMessageRequest,
} from "./models/Message";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";
import type { Room } from "./models/Room";
import type { User } from "./models/User";

export interface MessageStoreState {
  messages: Message[];
  selectedRoom?: Room;
  selectedUser?: User;
}

const useMessageStore = defineStore({
  id: "message-store",
  state: () =>
    ({
      messages: [],
      selectedRoom: undefined,
      selectedUser: undefined,
    } as MessageStoreState),
  actions: {
    async fetchMessage() {
      const userStore = useUserStore();
      if (userStore.user) {
        const request: FetchMessageRequest = {
          senderId: userStore.user?.id,
          repepientId: this.selectedUser?.id,
          roomId: this.selectedRoom?.id,
        };
        const { data } = await ApiHelper.get(`${API_URL.MESSAGE}`, {
          params: request,
        });
        console.log("[Fetch Message] >>>>", data);

        this.messages = data;
      }
    },

    async sendMessage(content: string) {
      const userStore = useUserStore();
      if (userStore.user) {
        const request: SendMessageRequest = {
          senderId: userStore.user?.id,
          messageContent: content,
          recepientId: this.selectedUser?.id,
          roomId: this.selectedRoom?.id,
        };
        await ApiHelper.post(`${API_URL.MESSAGE}`, request);
      }
    },
    setSelectedRoom(value?: Room) {
      this.selectedRoom = value;
      this.selectedUser = undefined;
    },
    setSelectedUser(value?: User) {
      this.selectedUser = value;
      this.selectedRoom = undefined;
    },
    receiveMessage(values: any) {
      console.log("[Store Receive]>>>", values);
      this.messages = [...this.messages, values];
    },
  },
});
// ChatHub.client.on("ReceiveRoomMessage", () => {
//   console.log("[Room Meesage]");
// });
// ChatHub.client.on("ReceivePrivateMeesage", () => {
//   console.log("[PrivateMessage]");
// });
export default useMessageStore;
