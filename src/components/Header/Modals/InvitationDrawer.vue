<template>
  <div @click.stop="open = true">
    <DrawerComponent :width="`300px`" :open="open" @close="open = false">
      <TransitionGroup name="list" tag="ul">
        <InvitationItem
          v-for="item in invitationStore.invitations"
          :key="item.id"
        ></InvitationItem>
        <InvitationItem></InvitationItem>
      </TransitionGroup>
    </DrawerComponent>
    <font-awesome-icon icon="bell"></font-awesome-icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DrawerComponent from "@/components/common/DrawerComponent.vue";
import useInvitationStore from "@/stores/InvitationStore";
import InvitationItem from "../InvitationItem.vue";
export default defineComponent({
  setup() {
    const invitationStore = useInvitationStore();
    invitationStore.$subscribe(async (mutation, state) => {
      if (mutation.events.key == `invitations`) {
        await invitationStore.fetchInvitationByUser();
      }
    });
    return {
      invitationStore,
    };
  },
  data: () => ({
    open: false,
  }),
  components: {
    DrawerComponent,
    InvitationItem,
  },
});
</script>

<style scoped lang="scss"></style>
