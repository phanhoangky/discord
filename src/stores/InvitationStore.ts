import { useRoomStore } from "./RoomStore";
import ApiHelper from "@/api";
import { defineStore } from "pinia";
import { API_URL } from "./Constant";
import type { BaseGetRequest } from "./models/BaseModel";
import type {
  Invitation,
  ReplyInvitationRequest,
  SendInvitationRequest,
  UpdateInvitationRequest,
} from "./models/Invitation";

export interface InvitationStoreState {
  invitations: Invitation[];
}

const useInvitationStore = defineStore({
  id: "invitation",
  state: () =>
    ({
      invitations: [],
    } as InvitationStoreState),
  getters: {},
  actions: {
    async sendInvitations(request: SendInvitationRequest) {
      console.log(request);

      await ApiHelper.post(`${API_URL.INVITATION}`, request);
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
      await ApiHelper.put(`${API_URL.INVITATION}/reply`, {
        invitationId: request.invitationId,
        isAccepted: request.isAccepted,
      } as ReplyInvitationRequest).then(async () => {
        this.invitations = this.invitations.filter(
          (i) => i.id != request.invitationId
        );
        const roomStore = useRoomStore();
        await roomStore.fetchRooms();
      });
      // await this.fetchInvitationByUser();
    },

    async receiveInvitation(invitation: Invitation) {
      console.log("[Receive Invitation] >>>", invitation);

      this.invitations = [...this.invitations, invitation];
    },

    async updateIsReadInvitations(request: UpdateInvitationRequest) {
      await ApiHelper.put(`${API_URL.INVITATION}`, request);
    },
  },
});

export default useInvitationStore;
