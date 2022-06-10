<template>
  <BaseModal
    :modal-name="`Edit Room`"
    :show="roomStore.showEditModal"
    width="30%"
    @close="roomStore.setShowEditModal(false)"
    @submit="onSubmit"
  >
    <form @submit="onSubmit">
      <div class="field-group">
        <label for="name"><span>Name</span></label>
        <!-- <Field name="name"></Field> -->
        <input id="name" name="name" v-model="name" />
      </div>
      <span class="error-message">{{ nameError }}</span>
      <!-- <ErrorMessage name="name" class="error-message"></ErrorMessage> -->
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
  <button
    class="click-ani"
    v-if="selectedRoom"
    @click="roomStore.setShowEditModal(true)"
  >
    <font-awesome-icon icon="gear"></font-awesome-icon>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseModal from "@/components/common/BaseModal.vue";
import { useForm, useField } from "vee-validate";
import { mapActions, mapState } from "pinia";
import { useRoomStore } from "@/stores/RoomStore";
import * as yup from "yup";
import ConfirmPopup from "../../common/ConfirmPopup.vue";
export default defineComponent({
  setup() {
    const roomStore = useRoomStore();
    const schema = yup.object({
      name: yup.string().required().max(50).min(5),
    });

    const { setValues, handleSubmit } = useForm({
      validationSchema: schema,
      // initialValues: {
      //   name: roomStore.selectedRoom?.name,
      // },
    });

    const { value: name, errorMessage: nameError } = useField("name");

    roomStore.$subscribe((mutation, state) => {
      if (state.showEditModal == true) {
        setValues({
          name: roomStore.selectedRoom?.name,
        });
      }
    });

    // Method
    const onSubmit = handleSubmit(async (values) => {
      roomStore
        .editRoom({ id: roomStore.selectedRoom?.id, ...values })
        .then(() => {
          roomStore.setShowEditModal(false);
        });
    });

    const deleteRoom = async () => {
      console.log("Delete");

      if (roomStore.selectedRoom) {
        await roomStore.deleteRoom(roomStore.selectedRoom.id);
        roomStore.setShowEditModal(false);
      }
    };
    return {
      roomStore,
      onSubmit,
      deleteRoom,
      name,
      nameError,
    };
  },
  components: {
    BaseModal,
    // Field,
    // ErrorMessage,
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
