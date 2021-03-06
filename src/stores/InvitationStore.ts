import { useRoomStore } from "./RoomStore";
import ApiHelper from "@/api";
import { defineStore } from "pinia";
import { API_URL } from "./Constant";
import type { BaseGetRequest } from "./models/BaseModel";
import type {
  Invitation,
  ReplyInvitationRequest,
  SendInvitationRequest,
  UpdateInvitationByUserRequest,
  UpdateInvitationRequest,
} from "./models/Invitation";
import type { User } from "./models/User";
import useUserStore from "./UserStore";

export interface InvitationStoreState {
  invitations: Invitation[];
  showInviteUsersModal: boolean;
}

const useInvitationStore = defineStore({
  id: "invitation",
  state: () =>
    ({
      invitations: [],
      showInviteUsersModal: false,
    } as InvitationStoreState),
  getters: {},
  actions: {
    async sendInvitations(request: SendInvitationRequest) {
      console.log(request);
      const base: SendInvitationRequest = {
        ...request,
        isLoading: true,
        isNotify: true,
      };
      await ApiHelper.post(`${API_URL.INVITATION}`, base);
    },

    async fetchInvitationByUser() {
      const request: BaseGetRequest = {
        currentItemsCount: this.invitations.length,
        currentPage: 0,
        isInfiniteScroll: true,
        isPaging: false,
        isLoading: true,
        itemsPerPage: 10,
      };
      const { data } = await ApiHelper.get(`${API_URL.INVITATION}`, {
        params: request,
      });
      this.invitations = data.results;
    },

    async replyInvitation(request: ReplyInvitationRequest) {
      const baseRequest: ReplyInvitationRequest = {
        ...request,
        isLoading: true,
        isNotify: true,
      };
      await ApiHelper.put(`${API_URL.INVITATION}/reply`, baseRequest);
      this.invitations = this.invitations.filter(
        (i) => i.id != request.invitationId
      );
      const roomStore = useRoomStore();
      await roomStore.fetchRooms();
      await this.fetchInvitationByUser();
    },

    async receiveInvitation(invitation: Invitation) {
      console.log("[Receive Invitation] >>>", invitation);

      this.invitations = [...this.invitations, invitation];
    },

    async updateIsReadInvitations(request: UpdateInvitationRequest) {
      const baseRequest: UpdateInvitationRequest = {
        ...request,
        isLoading: true,
        isNotify: false,
      };
      await ApiHelper.put(`${API_URL.INVITATION}`, baseRequest);
    },
    async updateInvitationsByUser(request: UpdateInvitationByUserRequest) {
      const baseRequest: UpdateInvitationByUserRequest = {
        ...request,
        isLoading: true,
        isNotify: false,
      };
      await ApiHelper.put(
        `${API_URL.INVITATION}/${request.userId}`,
        baseRequest
      );
    },

    async onInvitationAccepted(user: User, roomId: string) {
      const userStore = useUserStore();
      const roomStore = useRoomStore();
      if (roomStore.selectedRoom) {
        if (roomId == roomStore.selectedRoom?.id) {
          userStore.$patch({
            users: [...userStore.users, user],
          });
        }
      }
    },
  },
});

export default useInvitationStore;
