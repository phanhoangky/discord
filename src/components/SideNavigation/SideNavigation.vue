<template>
  <div class="logo" @click="reset">
    <img src="@/assets/logo.svg" />
  </div>
  <button class="add-room-btn click-ani" @click="() => {}">
    <font-awesome-icon icon="user-plus"></font-awesome-icon>
  </button>

  <button class="add-room-btn click-ani" @click="setShowCreateModal(true)">
    <font-awesome-icon icon="plus-square"></font-awesome-icon>
  </button>

  <ul class="menu-container">
    <li
      class="menu-item"
      v-for="item in rooms"
      :key="item.id"
      :class="item.id == selectedRoom?.id ? 'active' : ''"
      @click="
        () => {
          setSelectedRoom(item);
          setRoom(item);
        }
      "
    >
      <span>{{ item.name }}</span>

      <font-awesome-icon
        icon="gear"
        class="edit-btn"
        @click="
          () => {
            setShowEditModal(true);
          }
        "
      ></font-awesome-icon>
    </li>
  </ul>
  <CreateRoomModal></CreateRoomModal>
  <EditRoomModal></EditRoomModal>
</template>

<script lang="ts">
import { useRoomStore } from "@/stores/RoomStore";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { object, string } from "yup";
import EditRoomModal from "./Modal/EditRoomModal.vue";
import CreateRoomModal from "./Modal/CreateRoomModal.vue";
import useMessageStore from "@/stores/MessageStore";
import InviteUsersModal from "./Modal/InviteUsersModal.vue";
export default defineComponent({
  setup() {
    const schema = object({
      name: string().required().max(50),
    });
    return {
      schema,
    };
  },
  components: {
    // LoadingScreen,
    // BaseModal,
    // Field,
    // ErrorMessage,
    EditRoomModal,
    CreateRoomModal,
  },
  computed: {
    ...mapState(useRoomStore, {
      rooms: "rooms",
    }),
    ...mapState(useMessageStore, {
      selectedRoom: "selectedRoom",
    }),
  },
  methods: {
    ...mapActions(useRoomStore, {
      fetchRooms: "fetchRooms",
      setShowCreateModal: "setShowCreateModal",
      setShowEditModal: "setShowEditModal",
      setRoom: "setSelectedRoom",
    }),
    ...mapActions(useMessageStore, {
      setSelectedRoom: "setSelectedRoom",
      setSelectedUser: "setSelectedUser",
    }),
    reset() {
      this.setSelectedRoom(undefined);
      this.setSelectedUser(undefined);
    },
  },

  async created() {
    await this.fetchRooms();
  },
});
</script>

<style scoped lang="scss">
.logo {
  width: 50%;
  background-color: var(--vt-c-divider-dark-1);
  border-radius: 100%;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.5s ease;
  padding: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    aspect-ratio: 1 / 1;
  }
  &:hover {
    background-color: var(--vt-c-blue-light-2);
    border-radius: 25%;
  }
}
button {
  width: 100%;
  margin-bottom: 5px;
  flex-shrink: 0;
}
.menu-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5px;
  flex: 1;
  flex-shrink: 0;
  overflow-y: scroll;
  overflow-x: hidden;
  .add-room-btn {
    margin-bottom: 10px;
    font-size: 1.2em;
  }
  .menu-item {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    padding: 1em;
    transition: all 0.5s ease;
    border-radius: 10px;
    margin-bottom: 5px;
    border-bottom: 1px solid var(--vt-c-white-soft);
    text-decoration: none;
    color: inherit;
    .edit-btn {
      position: absolute;
      width: 0;
      right: 0;
      padding: 0;
      overflow: hidden;
    }
    &.active {
      background-color: var(--vt-c-black-soft);
      .edit-btn {
        width: auto;
        padding: 1em;
      }
    }
    &:hover {
      background-color: var(--vt-c-black-mute);
      color: var(--vt-c-button-hover-text);
      border-top: 1px solid var(--vt-c-white-soft);
      .edit-btn {
        width: auto;
        padding: 1em;
      }
    }
  }
}

@media only screen and (min-width: 40em) {
}
</style>
