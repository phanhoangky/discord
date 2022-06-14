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
  uploadFile,
} from "@/utilities/Firebase";
import type { FullMetadata, UploadMetadata } from "@firebase/storage";
import { useRoomStore } from "./RoomStore";

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

        for (let index = 0; index < data.results.length; index++) {
          const element = data.results[index];
          if (element.filePath != "") {
            // element.filePath = await fetchFileURL(element.filePath);
            const fileMetadata = (await fetchFileMetadata(
              element.filePath
            )) as FullMetadata;
            console.log("[Metadata] >>>", element, fileMetadata);
            element.file = {
              ...fileMetadata,
              filePath: element.filePath,
            };
            if (fileMetadata.contentType?.includes("image")) {
              element.file.type = "image";
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
        if (file && filePath) {
          const metadata: UploadMetadata = {
            // contentType: file.type.includes("image") ? "image" : "other",
          };
          await uploadFile(filePath, file, metadata);
          const downloadURL = await fetchFileURL(filePath);
          request.filePath = downloadURL;
        }

        console.log("[Send Message Request] >>>>", request);
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
    async receiveMessage(values: any) {
      console.log("[Store Receive]>>>", values);
      const userStore = useUserStore();
      const source =
        !this.selectedRoom && !this.selectedUser
          ? userStore.users
          : userStore.usersInRoom;
      const receiverId = values.messageRecipients[0].recepientId;
      source.filter((s) => s.id == receiverId)[0].notReadMessages++;

      if (this.selectedUser) {
        const newMesasge: Message = {
          ...values,
        };
        if (values.filePath && values.filePath != "") {
          // const fileURL = await fetchFileURL(values.filePath);
          const metadata = (await fetchFileMetadata(
            values.filePath
          )) as FullMetadata;
          newMesasge.file = {
            filePath: values.filePath,
            fullPath: metadata.fullPath,
            name: metadata.name,
            size: metadata.size,
            type: metadata.contentType,
          };
          // values.fileType = metadata.contentType;
        }
        this.$patch({
          messages: [...this.messages, newMesasge],
        });
      }
    },
    async receiveGroupMessage(values: any) {
      console.log("[Store Receive receiveGroupMessage]>>>", values);
      const rooms = useRoomStore().rooms;

      const receiverId = values.messageRecipients[0].roomId;
      if (rooms.length > 0) {
        const receiver = rooms.filter((r) => r.id == receiverId);
        if (receiver.length > 0) {
          receiver[0].notReadMessages++;
        }
      }
      if (this.selectedRoom) {
        const newMesasge: Message = {
          ...values,
        };
        if (values.filePath && values.filePath != "") {
          const metadata = (await fetchFileMetadata(
            values.filePath
          )) as FullMetadata;
          newMesasge.file = {
            filePath: values.filePath,
            fullPath: metadata.fullPath,
            name: metadata.name,
            size: metadata.size,
            type: metadata.contentType,
          };
          // values.fileType = metadata.contentType;
        }

        this.$patch({
          messages: [...this.messages, newMesasge],
        });
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
