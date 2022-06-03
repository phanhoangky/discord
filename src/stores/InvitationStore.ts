import ApiHelper from "@/api";
import { defineStore } from "pinia";
import { API_URL } from "./Constant";
import type { BaseGetRequest } from "./models/BaseModel";
import type { Invitation, SendInvitationRequest } from "./models/Invitation";

export interface InvitationStoreState {
  invitations: Invitation[];
}

const useInvitationStore = defineStore({
  id: "invitation",
  state: () =>
    ({
      invitations: [],
    } as InvitationStoreState),
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
        itemsPerPage: 10,
      };
      const { data } = await ApiHelper.get(`${API_URL.INVITATION}`, {
        params: request,
      });
      this.invitations = data.results;
    },
  },
});

export default useInvitationStore;
