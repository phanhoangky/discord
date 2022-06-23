<template>
  <BaseModal
    modal-name="CREATE NEW ROOM"
    @close="
      () => {
        setIsShow(false);
        resetForm();
      }
    "
    :width="`30%`"
    :show="roomStore.showCreateModal"
    @submit="onSubmit"
  >
    <form ref="form" @submit="onSubmit">
      <div class="field-group">
        <label for="name">Name</label>
        <input type="text" name="name" id="name" v-model="name" />
      </div>
      <span class="error-message">{{ nameError }}</span>
    </form>
  </BaseModal>
</template>

<script lang="ts">
import BaseModal from "@/components/common/BaseModal.vue";
import { useRoomStore } from "@/stores/RoomStore";
import { mapActions } from "pinia";
import { defineComponent } from "vue";
import { useForm, useField } from "vee-validate";
import { object, string } from "yup";
export default defineComponent({
  setup() {
    const schema = object({
      name: string().required().max(50).min(5),
    });

    const roomStore = useRoomStore();
    const setIsShow = (isShow: boolean) => roomStore.setShowCreateModal(isShow);

    const { handleSubmit, resetForm } = useForm({
      validationSchema: schema,
    });
    const { value: name, errorMessage: nameError } = useField("name");
    const onSubmit = handleSubmit(async (values) => {
      await roomStore.createRoom(values);
      // console.log("asd");

      setIsShow(false);
    });
    return {
      schema,
      roomStore,
      name,
      nameError,
      onSubmit,
      resetForm,
      setIsShow,
    };
  },
  components: {
    BaseModal,
  },

  methods: {
    ...mapActions(useRoomStore, {
      fetchRooms: "fetchRooms",
    }),
  },
});
</script>

<style scoped lang="scss">
form {
  .field-group {
    input[type="text"] {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
  }
}
</style>
