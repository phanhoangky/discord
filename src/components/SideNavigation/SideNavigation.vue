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
      :class="{
        active: item.id == selectedRoom?.id,
        blink: item.notReadMessages > 0,
      }"
      @click="selectItem(item)"
    >
      <div v-if="item.notReadMessages > 0" class="not-read">
        {{ item.notReadMessages }}
      </div>
      <span>{{ item.name }}</span>
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
        this.$router.push({ name: "home" });
      }
      useMessageStore().resetSelectedRoomAndUser();
      this.setRoom(undefined);
    },
    selectItem(item: Room) {
      if (this.$route.path != "/") {
        this.$router.push({ name: "home" });
      }
      if (!this.selectedRoom || this.selectedRoom != item) {
        // setSelectedUser(undefined);
        this.update(item);
      }
    },
    async update(item: Room) {
      const room = await this.updateNotReadMessageOfRoomByUser(item.id);
      if (room) {
        this.setRoom(room);
        this.setSelectedRoom(item);
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
  padding: 1em 2px;
  flex: 1;
  flex-shrink: 0;
  overflow-y: scroll;
  .add-room-btn {
    margin-bottom: 10px;
    font-size: 1.2em;
  }
  .menu-item {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    transition: all 0.5s ease;
    border-radius: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid var(--vt-c-white-soft);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    .not-read {
      aspect-ratio: 1 / 1;
      width: 25px;
      border-radius: 50%;
      background-color: var(--vt-c-red-soft);
      box-shadow: 0px 0px 2px 2px var(--vt-c-red-soft);
      position: absolute;
      right: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--vt-c-white-soft);
    }
    &.active {
      background-color: var(--vt-c-button-hover-bg);
      color: var(--vt-c-button-hover-text);
      box-shadow: 0px 0px 5px 5px var(--vt-c-blue-light-2);
      transform: skewY(5deg);
    }
    &.blink {
      animation: blink 1s linear;
      animation-iteration-count: infinite;
    }
    &:hover {
      background-color: var(--vt-c-black-mute);
      color: var(--vt-c-button-hover-text);
      // border-top: 1px solid var(--vt-c-white-soft);
    }
  }
}
@keyframes blink {
  0% {
    outline: 0px solid var(--vt-c-red-soft);
  }
  50% {
    outline: 5px solid var(--vt-c-red-soft);
  }
  100% {
    outline: 0px solid var(--vt-c-red-soft);
  }
}
@media only screen and (min-width: 40em) {
}
</style>
