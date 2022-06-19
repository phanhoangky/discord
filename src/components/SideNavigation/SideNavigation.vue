<template>
  <div class="logo" @click="reset">
    <img src="@/assets/logo.svg" />
  </div>
  <div class="function-button-group">
    <button class="add-room-btn click-ani" @click="setShowCreateModal(true)">
      <font-awesome-icon icon="plus-square"></font-awesome-icon>
    </button>
  </div>
  <font-awesome-icon icon="campground" class="group-header"></font-awesome-icon>
  <ul class="menu-container">
    <li
      class="menu-item"
      v-for="item in rooms"
      :key="item.id"
      :class="item.id == selectedRoom?.id ? 'active' : ''"
      @click="selectItem(item)"
    >
      <div class="not-read">{{ item.notReadMessages }}</div>
      <span>{{ item.name }}</span>

      <!-- <font-awesome-icon
        icon="gear"
        class="edit-btn"
        @click="
          () => {
            setShowEditModal(true);
          }
        "
      ></font-awesome-icon> -->
    </li>
  </ul>
  <CreateRoomModal></CreateRoomModal>
  <!-- <EditRoomModal></EditRoomModal> -->
</template>

<script lang="ts">
import { useRoomStore } from "@/stores/RoomStore";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { object, string } from "yup";
import CreateRoomModal from "./Modal/CreateRoomModal.vue";
import useMessageStore from "@/stores/MessageStore";
import type { Room } from "@/stores/models/Room";
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
    // EditRoomModal,
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
      fetchRoomById: "fetchRoomById",
      updateNotReadMessageOfRoomByUser: "updateNotReadMessageOfRoomByUser",
    }),
    ...mapActions(useMessageStore, {
      setSelectedRoom: "setSelectedRoom",
      setSelectedUser: "setSelectedUser",
    }),
    reset() {
      if (this.$route.path != "/") {
        console.log(this.$route);
        this.$router.push("/");
      }
      useMessageStore().$patch({
        selectedRoom: undefined,
        selectedUser: undefined,
      });
      this.setRoom(undefined);
    },
    async selectItem(item: Room) {
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
      if (this.selectedRoom != item) {
        // setSelectedUser(undefined);
        const room = await this.updateNotReadMessageOfRoomByUser(item.id);
        if (room) {
          this.setRoom(room);
          this.setSelectedRoom(item);
        }
      }
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
  background-color: var(--color-heading);
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

.function-button-group {
  padding: 5px;
  width: 100%;
  margin: 10px 0;
  button {
    width: 100%;
    margin-bottom: 5px;
    flex-shrink: 0;
  }
}
.group-header {
  font-size: 2em;
  font-weight: bold;
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
    justify-content: space-between;
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
    .not-read {
      aspect-ratio: 1 / 1;
      width: 25px;
      border-radius: 50%;
      background-color: var(--vt-c-red-soft);
      position: absolute;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--vt-c-white-soft);
    }
    &.active {
      background-color: var(--vt-c-button-hover-bg);
      color: var(--vt-c-button-hover-text);
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
