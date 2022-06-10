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
import {
  fetchFileMetadata,
  fetchFileURL,
  refFile,
  uploadFile,
} from "@/utilities/Firebase";
import type { FullMetadata, UploadMetadata } from "@firebase/storage";

export interface MessageStoreState {
  messages: Message[];
  totalItem: number;
  selectedRoom?: Room;
  selectedUser?: User;
}

const useMessageStore = defineStore({
  id: "message-store",
  state: () =>
    ({
      messages: [],
      totalItem: 0,
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
          currentItemsCount: this.messages.length,
          currentPage: 0,
          isInfiniteScroll: true,
          isPaging: true,
          itemsPerPage: 10,
        };
        const { data } = await ApiHelper.get(`${API_URL.MESSAGE}`, {
          params: request,
        });
        // await data.results.forEach(async (element: Message) => {
        //   if (element.filePath != "") {
        //     const fileURL = await getURL(element.filePath);
        //     element.filePath = fileURL;
        //   }
        // });
        for (let index = 0; index < data.results.length; index++) {
          const element = data.results[index];
          if (element.filePath != "") {
            element.filePath = await fetchFileURL(element.filePath);
            const fileMetadata = (await fetchFileMetadata(
              element.filePath
            )) as FullMetadata;
            if (fileMetadata.contentType?.includes("image")) {
              element.fileType = "image";
            }
          }
        }
        const temp = [...data.results, ...this.messages];
        console.log("[Fetch Message] >>>>", temp, data);
        this.totalItem = data.totalCount;
        this.$patch({
          messages: temp,
        });
        return data;
      }
      return null;
    },

    async sendMessage(file?: File, content?: string, filePath?: string) {
      const userStore = useUserStore();
      if (userStore.user) {
        const request: SendMessageRequest = {
          senderId: userStore.user?.id,
          messageContent: content ? content : "",
          recepientId: this.selectedUser?.id,
          roomId: this.selectedRoom?.id,
          filePath,
        };
        console.log("[Send Message Request] >>>>", request);
        if (file && filePath) {
          const metadata: UploadMetadata = {
            // contentType: file.type.includes("image") ? "image" : "other",
          };
          await uploadFile(filePath, file, metadata);
        }

        await ApiHelper.post(`${API_URL.MESSAGE}`, request, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
    },
    setSelectedRoom(value?: Room) {
      // this.selectedUser = undefined;
      // this.selectedRoom = value;
      this.$patch({
        selectedRoom: value,
        selectedUser: undefined,
      });
    },
    setSelectedUser(value?: User) {
      // this.selectedRoom = undefined;
      // this.selectedUser = value;
      this.$patch({
        selectedRoom: undefined,
        selectedUser: value,
      });
    },
    async receiveMessage(values: Message) {
      console.log("[Store Receive]>>>", values);
      if (values.filePath != "") {
        const fileURL = await fetchFileURL(values.filePath);
        const metadata = (await fetchFileMetadata(
          values.filePath
        )) as FullMetadata;
        if (fileURL && fileURL != "") {
          values.fileType = metadata.contentType;
        }
        values.filePath = fileURL;
      }
      if (this.selectedUser) {
        this.$patch({
          messages: [...this.messages, values],
        });
      }
    },
    async receiveGroupMessage(values: any) {
      console.log("[Store Receive receiveGroupMessage]>>>", values);
      if (values.filePath != "") {
        const fileURL = await fetchFileURL(values.filePath);
        const metadata = (await fetchFileMetadata(
          values.filePath
        )) as FullMetadata;
        if (fileURL && fileURL != "") {
          values.fileType = metadata.contentType;
        }
        values.filePath = fileURL;
      }
      if (this.selectedRoom) {
        this.$patch({
          messages: [...this.messages, values],
        });
        // this.messages = [...this.messages, values];
      }
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
