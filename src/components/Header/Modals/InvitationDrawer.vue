<template>
  <div @click.stop="openDrawer" class="icon">
    <DrawerComponent :width="`300px`" :open="open" @close="open = false">
      <TransitionGroup name="list" tag="ul">
        <InvitationItem
          v-for="item in invitationStore.invitations"
          :key="item.id"
          :content="item.invitationContent"
          @agree="onReply(item.id, true)"
          @decline="onReply(item.id, false)"
        ></InvitationItem>
      </TransitionGroup>
    </DrawerComponent>
    <font-awesome-icon icon="bell"></font-awesome-icon>
    <div>{{ newInvitation }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import DrawerComponent from "@/components/common/DrawerComponent.vue";
import useInvitationStore from "@/stores/InvitationStore";
import InvitationItem from "../InvitationItem.vue";
import { mapActions, mapState } from "pinia";
import type {
  InvitationCompositeKey,
  ReplyInvitationRequest,
  UpdateInvitationRequest,
} from "@/stores/models/Invitation";
export default defineComponent({
  setup() {
    const invitationStore = useInvitationStore();
    // invitationStore.$subscribe(async (mutation, state) => {
    //   if (mutation.events.key == `invitations`) {
    //     await invitationStore.fetchInvitationByUser();
    //   }
    // });
    let newInvitation = computed(() => {
      const total = invitationStore.invitations.filter(
        (e) => e.isRead == false
      ).length;
      return total;
    });
    return {
      invitationStore,
      newInvitation,
    };
  },

  components: {
    DrawerComponent,
    InvitationItem,
  },
  data: () => ({
    open: false,
  }),
  computed: {
    ...mapState(useInvitationStore, {
      invitations: "invitations",
    }),
  },
  methods: {
    ...mapActions(useInvitationStore, {
      reply: "replyInvitation",
      updateIsReadInvitations: "updateIsReadInvitations",
    }),
    async openDrawer() {
      this.open = true;
      if (this.invitations.some((i) => i.isRead == false)) {
        let updateList: InvitationCompositeKey[] = [];

        this.invitations.forEach((invitation) => {
          console.log(invitation);
          if (invitation.isRead == false) {
            invitation.isRead = true;
            updateList.push({
              id: invitation.id,
              receiverId: invitation.receiverId,
              senderId: invitation.senderId,
            });
          }
        });
        const request: UpdateInvitationRequest = {
          keys: updateList,
          isRead: true,
        };
        await this.updateIsReadInvitations(request);
      }
    },
    async onReply(invitationId: string, isAccepted: boolean) {
      const request: ReplyInvitationRequest = {
        invitationId: invitationId,
        isAccepted: isAccepted,
      };
      await this.reply(request);
    },
  },
});
</script>

<style scoped lang="scss"></style>
