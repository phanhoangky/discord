<template>
  <div class="confirm-kick-user-modal-wrapper">
    <BaseModal
      :modal-name="`Kick User`"
      :show="show"
      @close="emits('close')"
      @submit="kickUser"
    >
      <div class="modal-body">
        <span
          >Do you want to kick {{ user && user.firstName }}
          {{ user && user.lastName }} ?</span
        >
      </div>
      <template #submit-button>Kick</template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import BaseModal from "@/components/common/BaseModal.vue";
import type { User } from "@/stores/models/User";
import { useRoomStore } from "@/stores/RoomStore";
//
export interface Props {
  show: boolean;
  user?: User;
}
export interface Emits {
  close: () => any;
}
const props = withDefaults(defineProps<Props>(), {});
const emits = defineEmits(["close"]);
//Store
const roomStore = useRoomStore();
//State

//Method
const kickUser = async () => {
  if (roomStore.selectedRoom && props.user) {
    await roomStore.kickUserFromRoom(props.user, roomStore.selectedRoom.id);
    emits("close");
  }
};
</script>

<style scoped lang="scss">
.modal-body {
  width: 100%;
  text-align: center;
}
</style>
