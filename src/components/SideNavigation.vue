<template>
  <div class="logo">
    <img src="@/assets/logo.svg" />
  </div>
  <ul class="menu-container">
    <button
      class="add-room-btn"
      @click="
        () => {
          isShow = true;
        }
      "
    >
      <font-awesome-icon icon="plus-square"></font-awesome-icon>
    </button>
    <!-- <router-link class="menu-item" to="/">Home</router-link>
    <router-link class="menu-item" to="/Device">Device</router-link> -->
    <li class="menu-item" v-for="item in rooms" :key="item.id">
      {{ item.name }}
    </li>
  </ul>
  <BaseModal
    modal-name="CREATE NEW ROOM"
    @close="
      () => {
        isShow = false;
      }
    "
    :width="`30%`"
    :show="isShow"
    @submit="createRoom"
  >
    <form @submit="createRoom" :validation-schema="schema">
      <label for="name">Name</label>
      <Field name="name" id="name"></Field>
      <ErrorMessage name="name" class="error-message"></ErrorMessage>
    </form>
  </BaseModal>
</template>

<script lang="ts">
import { useRoomStore } from "@/stores/RoomStore";
import { mapActions, mapState } from "pinia";
import { defineComponent, ref } from "vue";
import { Field, ErrorMessage } from "vee-validate";
// import LoadingScreen from "./common/LoadingScreen.vue";
import BaseModal from "./common/BaseModal.vue";
import { object, string } from "yup";
import { useForm } from "vee-validate";
import { useLoadingScreenStore } from "@/stores/LoadingScreen";
export default defineComponent({
  setup() {
    const { handleSubmit } = useForm();
    const schema = object({
      name: string().required().max(50),
    });
    let isShow = ref(false);
    const roomStore = useRoomStore();
    const loadingSreenStore = useLoadingScreenStore();
    const createRoom = handleSubmit(async (values) => {
      loadingSreenStore.setIsLoading(true);
      await roomStore.createRoom(values).then(() => {
        loadingSreenStore.setIsLoading(false);
        isShow.value = false;
      });
    });
    return {
      schema,
      createRoom,
      isShow,
    };
  },

  computed: {
    ...mapState(useRoomStore, {
      rooms: "rooms",
    }),
  },
  methods: {
    ...mapActions(useRoomStore, {
      fetchRooms: "fetchRooms",
    }),
  },
  async created() {
    await this.fetchRooms();
  },
  components: {
    // LoadingScreen,
    BaseModal,
    Field,
    ErrorMessage,
  },
});
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  background-color: var(--vt-c-divider-dark-1);
  border-radius: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  transition: all 0.5s ease;
  padding: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 60%;
  }
  &:hover {
    background-color: var(--vt-c-blue-light-2);
    border-radius: 25%;
  }
}
.menu-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5px;
  .add-room-btn {
    margin-bottom: 10px;
    font-size: 1.2em;
  }
  .menu-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    transition: all 0.5s ease;
    border-radius: 10px;
    margin-bottom: 5px;
    border-bottom: 1px solid var(--vt-c-white-soft);
    text-decoration: none;
    color: inherit;
    &:hover {
      background-color: var(--vt-c-black-mute);
      color: var(--vt-c-button-hover-text);
      border-top: 1px solid var(--vt-c-white-soft);
    }
  }
}
</style>
