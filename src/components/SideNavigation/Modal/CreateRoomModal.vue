<template>
  <BaseModal
    modal-name="CREATE NEW ROOM"
    @close="setIsShow(false)"
    :width="`30%`"
    :show="roomStore.showCreateModal"
    @submit="onSubmit"
  >
    <form ref="form" @submit="onSubmit" :validation-schema="schema">
      <div class="field-group">
        <label for="name">Name</label>
        <Field name="name" id="name"></Field>
      </div>
      <ErrorMessage name="name" class="error-message"></ErrorMessage>
    </form>
  </BaseModal>
</template>

<script lang="ts">
import BaseModal from "@/components/common/BaseModal.vue";
import { useRoomStore } from "@/stores/RoomStore";
import { mapActions } from "pinia";
import { defineComponent } from "vue";
import { Field, ErrorMessage, useForm } from "vee-validate";
// import LoadingScreen from "./common/LoadingScreen.vue";
import { object, string } from "yup";
export default defineComponent({
  setup() {
    const schema = object({
      name: string().required().max(50),
    });

    const roomStore = useRoomStore();
    const setIsShow = (isShow: boolean) => roomStore.setShowCreateModal(isShow);

    const { handleSubmit } = useForm();
    const onSubmit = handleSubmit(async (values) => {
      await roomStore.createRoom(values);
      setIsShow(false);
    });
    return {
      schema,
      onSubmit,
      roomStore,
      setIsShow,
    };
  },
  components: {
    // LoadingScreen,
    BaseModal,
    // Form,
    Field,
    ErrorMessage,
  },
  // computed: {
  //   ...mapState(useRoomStore, {
  //     rooms: "rooms",
  //     isShow: "showCreateModal",
  //     model: "createRoomModel",
  //   }),
  // },
  methods: {
    // ...mapActions(useLoadingScreenStore, {
    //   setLoadingScreen: "setIsLoading",
    // }),
    ...mapActions(useRoomStore, {
      fetchRooms: "fetchRooms",
      // setIsShow: "setShowCreateModal",
      // setCreateRoomModel: "setCreateRoomModel",
      // createRoom: "createRoom",
    }),
    //   async onSubmit(values: any) {
    //     const form = this.$refs.form;
    //     console.log("[Create Room]", form, values);
    //     this.setLoadingScreen(true);
    //     this.createRoom(values).then(() => {
    //       this.setLoadingScreen(false);
    //     });
    //   },
  },
  async created() {
    await this.fetchRooms();
  },
});
</script>

<style scoped lang="scss"></style>
