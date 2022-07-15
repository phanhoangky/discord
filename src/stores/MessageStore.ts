import useUserStore from "@/stores/UserStore";
import type {
  FetchMessageRequest,
  Message,
  SendMessageRequest,
  UpdateMessageRecipientRequest,
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
  state: (): MessageStoreState => ({
    messages: [],
    totalItem: 0,
    selectedRoom: undefined,
    selectedUser: undefined,
  }),
  actions: {
    async fetchMessage() {
      const userStore = useUserStore();
      if (userStore.user) {
        const request: FetchMessageRequest = {
          senderId: userStore.user?.id,
          recipientId: this.selectedUser?.id,
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
            const fileMetadata = (await fetchFileMetadata(
              element.filePath
            )) as FullMetadata;
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

        // console.log("[Send Message Request] >>>>", request);
        await ApiHelper.post(`${API_URL.MESSAGE}`, request, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
    },
    setSelectedRoom(value?: Room) {
      this.$patch({
        selectedRoom: value,
        selectedUser: undefined,
        messages: [],
        totalItem: 0,
      });
    },
    setSelectedUser(value?: User) {
      this.$patch({
        selectedRoom: undefined,
        selectedUser: value,
        messages: [],
        totalItem: 0,
      });
    },
    resetSelectedRoomAndUser() {
      this.$patch({
        selectedRoom: undefined,
        selectedUser: undefined,
        messages: [],
        totalItem: 0,
      });
    },
    async appendToMessageList(message) {
      const newMesasge: Message = {
        ...message,
      };
      if (message.filePath && message.filePath != "") {
        // const fileURL = await fetchFileURL(values.filePath);
        const metadata = (await fetchFileMetadata(
          message.filePath
        )) as FullMetadata;
        newMesasge.file = {
          filePath: message.filePath,
          fullPath: metadata.fullPath,
          name: metadata.name,
          size: metadata.size,
          type: metadata.contentType,
        };
      }
      this.$patch({
        messages: [...this.messages, newMesasge],
      });
    },
    async onSendMessage(message) {
      const userStore = useUserStore();
      const isSender = userStore.user?.id == message.senderId;
      if (isSender) {
        this.appendToMessageList(message);
      }
    },

    async onReceivePrivateMessage(values) {
      const userStore = useUserStore();
      const source = userStore.users;

      console.log("[Store Receive]>>>", values, source);
      const senderId = values.senderId;
      const senders = source.filter((s) => s.id == senderId);
      // If current user is a receiver
      // If list user contain a sender
      if (senders.length > 0) {
        // If user currently chat with other user
        if (
          !this.selectedUser ||
          (this.selectedUser && this.selectedUser.id != senderId)
        ) {
          senders[0].notReadMessages++;
        }

        // If user is current chat with message receiver or if current is sender
        if (this.selectedUser && this.selectedUser.id == senderId) {
          const newMesasge: Message = {
            ...values,
          };
          await this.appendToMessageList(newMesasge);

          // Update isRead = true to DB
          newMesasge.messageRecipients[0].isRead = true;
          console.log("[Update Is Read of New message ]", newMesasge);
          const request: UpdateMessageRecipientRequest = {
            id: newMesasge.messageRecipients[0].id,
            isRead: true,
            messageId: newMesasge.id,
            isLoading: false,
            recipientRoomId: undefined,
            recipientId: newMesasge.messageRecipients[0].recepientId,
          };
          await this.updateMessageRecipient(request);
        }
      }
    },

    async onReceiveGroupMessage(values) {
      console.log("[Store Receive receiveGroupMessage]>>>", values);
      const rooms = useRoomStore().rooms;
      const userStore = useUserStore();
      const receiverId = values.messageRecipients[0].roomId;
      if (rooms.length > 0) {
        // Receiver is a room
        const receivers = rooms.filter((r) => r.id == receiverId);
        // If found a room
        if (receivers.length > 0) {
          // Receiver is a room
          const receiver = receivers[0];
          // If user currently chat with others
          if (
            !this.selectedRoom ||
            (this.selectedRoom && this.selectedRoom.id != receiverId)
          ) {
            receiver.notReadMessages++;
          }
          // If user currently chat with receiver room
          if (this.selectedRoom && this.selectedRoom.id == receiver.id) {
            const newMesasge: Message = {
              ...values,
            };
            await this.appendToMessageList(newMesasge);
            // Update isRead = true to DB
            // Check if current user is not sender, because sender already set isRead = true in BE
            if (newMesasge.senderId != userStore.user?.id) {
              // Check if user is currently in the room
              const roomUser = newMesasge.messageRecipients.filter(
                (e) =>
                  e.userInRoomId == userStore.user?.id &&
                  e.roomId == this.selectedRoom?.id
              );
              if (roomUser.length > 0) {
                const request: UpdateMessageRecipientRequest = {
                  id: roomUser[0].id,
                  isRead: true,
                  isLoading: false,
                  messageId: newMesasge.id,
                  recipientRoomId: roomUser[0].recepientRoomId,
                  recipientId: undefined,
                };
                await this.updateMessageRecipient(request);
              }
            }
          }
        }
      }
    },

    async updateMessageRecipient(param) {
      const request: UpdateMessageRecipientRequest = {
        isLoading: false,
        ...param,
      };
      await ApiHelper.put(`${API_URL.MESSAGE_RECIPIENT}`, request);
    },
  },
});
export default useMessageStore;
