<template>
  <BaseModal
    :modal-name="`Edit Room`"
    :show="roomStore.showEditModal"
    @close="roomStore.setShowEditModal(false)"
    @submit="onSubmit"
  >
    <form @submit="onSubmit">
      <div class="field-group">
        <label for="name"><span>Name</span></label>
        <Field name="name" id="name" va></Field>
      </div>
      <ErrorMessage name="name" class="error-message"></ErrorMessage>
    </form>
    <template #footer>
      <ConfirmPopup
        title="Do you want to delete this channel"
        :confirm-async="deleteRoom"
        ><button class="cancel-btn cancel">
          <font-awesome-icon icon="trash-can"></font-awesome-icon></button
      ></ConfirmPopup>
      <button
        class="cancel-btn cancel"
        @click="roomStore.setShowEditModal(false)"
      >
        Cancel
      </button>
      <button class="submit-btn primary" @click="onSubmit">Edit</button>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseModal from "@/components/common/BaseModal.vue";
import { Form, Field, ErrorMessage, useForm } from "vee-validate";
import { mapActions, mapState } from "pinia";
import { useRoomStore } from "@/stores/RoomStore";
import ConfirmPopup from "../../common/ConfirmPopup.vue";
export default defineComponent({
  setup() {
    const roomStore = useRoomStore();
    const { setValues, handleSubmit } = useForm();
    const selectedRoom = roomStore.selectedRoom;
    setValues({
      name: selectedRoom?.name,
    });
    const onSubmit = handleSubmit(async (values) => {
      roomStore
        .editRoom({ id: roomStore.selectedRoom?.id, ...values })
        .then(() => {
          roomStore.setShowEditModal(false);
        });
    });
    const deleteRoom = async () => {
      console.log("Delete");

      if (selectedRoom) {
        await roomStore.deleteRoom(selectedRoom.id);
        roomStore.setShowEditModal(false);
      }
    };
    return {
      roomStore,
      onSubmit,
      deleteRoom,
    };
  },
  components: {
    BaseModal,
    Field,
    ErrorMessage,
    ConfirmPopup,
  },
  computed: {
    ...mapState(useRoomStore, {
      isShow: "showEditModal",
      selectedRoom: "selectedRoom",
    }),
  },
  methods: {
    ...mapActions(useRoomStore, {
      setIsShow: "setShowEditModal",
    }),
  },
});
</script>

<style scoped lang="scss"></style>
