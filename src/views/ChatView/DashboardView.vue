<template>
  <div class="grid-layout">
    <header>
      <div class="header-left">
        <InviteUsersModal v-if="selectedRoom"> </InviteUsersModal>
        <EditRoomModal
          v-if="selectedRoom?.creatorId == user?.id"
        ></EditRoomModal>
        <span>#</span>
        <span v-if="selectedRoom">{{ selectedRoom.name }}</span>
        <span v-if="selectedUser">
          {{ selectedUser.firstName }} {{ selectedUser.lastName }}
        </span>
      </div>
      <div v-if="showLeaveRoomButton">
        <ConfirmPopup
          :title="`Do you want to leave ?`"
          below
          center
          :confirm-async="leaveRoom"
        >
          <button class="click-ani">
            <font-awesome-icon icon="tent-arrow-turn-left"></font-awesome-icon>
          </button>
        </ConfirmPopup>
      </div>
    </header>
    <main
      class="main"
      id="main-messages-container"
      ref="main"
      @scroll="mainScroll"
    >
      <Transition name="message-slide">
        <ListMessagesComponent v-if="isShowChatWindow"></ListMessagesComponent>
      </Transition>
    </main>
    <aside
      class="sidebar"
      :class="{
        active: isShowUserInRoom,
      }"
    >
      <div
        class="open-sidebar-icon"
        @click="isShowUserInRoom = !isShowUserInRoom"
      >
        <Transition mode="out-in">
          <font-awesome-icon
            v-if="!isShowUserInRoom"
            icon="caret-left"
          ></font-awesome-icon>
          <font-awesome-icon v-else icon="caret-right"></font-awesome-icon>
        </Transition>
      </div>
      <UsersInRoomComponent></UsersInRoomComponent>
    </aside>
    <Transition>
      <footer class="footer" v-if="isShowChatWindow">
        <ChatInputComponent></ChatInputComponent>
      </footer>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted } from "vue";
import ListMessagesComponent from "./components/ListMessagesComponent.vue";
import UsersInRoomComponent from "./components/UsersInRoomComponent.vue";
import ChatInputComponent from "./components/ChatInputComponent.vue";
import { mapActions, mapState } from "pinia";
import useMessageStore from "@/stores/MessageStore";
import InviteUsersModal from "../../components/SideNavigation/Modal/InviteUsersModal.vue";
import useInvitationStore from "@/stores/InvitationStore";
import useUserStore from "@/stores/UserStore";
import EditRoomModal from "../../components/SideNavigation/Modal/EditRoomModal.vue";
import { useRoomStore } from "@/stores/RoomStore";
import ConfirmPopup from "../../components/common/ConfirmPopup.vue";
import { computed } from "@vue/reactivity";
import { scrollToBottom } from "@/utilities/ScrollToBottom";
export default defineComponent({
  setup() {
    // Store
    const invitationStore = useInvitationStore();
    const messageStore = useMessageStore();
    const userStore = useUserStore();
    //State
    const { showInviteUsersModal } = invitationStore;
    // Computed
    let showLeaveRoomButton = computed(() => {
      return (
        messageStore.selectedRoom &&
        messageStore.selectedRoom.creatorId != userStore.user?.id
      );
    });
    // Watch state and action
    // messageStore.$subscribe(async (mutation, state) => {
    //   console.log("[Dashboard Subscribe] >>>", mutation, state);

    //   const events: DebuggerEvent[] = mutation.events as DebuggerEvent[];
    //   const mutates: DebuggerEvent[] =
    //     events &&
    //     events.filter(
    //       (e) =>
    //         (e.key === "selectedRoom" && e.newValue) ||
    //         (e.key === "selectedUser" && e.newValue)
    //     );
    //   console.log("[Events] >>> ", mutates);
    //   // if (!state.selectedRoom && !state.selectedUser) {
    //   //   await userStore.fetchUsers();
    //   // }
    //   const event = mutates.length > 0 && mutates[0];
    //   if (event) {
    //     ///////
    //     if (event.newValue) {
    //       if (state.selectedRoom || state.selectedUser) {
    //         messageStore.totalItem = 0;
    //         messageStore.$patch({
    //           messages: [],
    //         });
    //         await messageStore.fetchMessage();
    //         nextTick(() => {
    //           scrollToBottom("main-messages-container");
    //         });
    //       }
    //     }
    //   }
    // });

    messageStore.$onAction(async ({ after, name, store }) => {
      if (name == "resetSelectedRoomAndUser") {
        if (store.selectedRoom || store.selectedUser) {
          console.log("[Watch Message action] >>>", "Fetch Users");
          await userStore.fetchUsers({ currentItemsCount: 0 });
          return;
        }
      }
      after(async () => {
        console.log(
          "[Watch Message action] >>>",
          "After Store",
          name,
          store.selectedRoom,
          store.selectedUser
        );

        if (name == "setSelectedRoom") {
          await userStore.fetchUsersInRoom({ currentItemsCount: 0 });
          await messageStore.fetchMessage();
          nextTick(() => {
            setTimeout(() => {
              scrollToBottom("main-messages-container");
            }, 300);
          });
          return;
        }
        if (name == "setSelectedUser") {
          await messageStore.fetchMessage();
          nextTick(() => {
            setTimeout(() => {
              scrollToBottom("main-messages-container");
            }, 300);
          });
          return;
        }
        if (
          (name == "onReceivePrivateMessage" && store.selectedUser) ||
          (name == "receiveGroupMessage" && store.selectedRoom) ||
          name == "onSendMessage"
        ) {
          nextTick(() => {
            scrollToBottom("main-messages-container");
          });
          return;
        }
      });
    });

    //Life circle hook
    onMounted(async () => {
      await invitationStore.fetchInvitationByUser();
    });

    return {
      showLeaveRoomButton,
      showInviteUsersModal,
    };
  },
  components: {
    // ListMessagesComponent: defineAsyncComponent({
    //   loader: () => import("./components/ListMessagesComponent.vue"),
    //   loadingComponent: SkeletonLoading,
    // }),
    ListMessagesComponent,
    UsersInRoomComponent,
    ChatInputComponent,
    InviteUsersModal,
    EditRoomModal,
    ConfirmPopup,
  },
  data: () => ({
    total: 0,
    isShowUserInRoom: false,
  }),
  computed: {
    ...mapState(useMessageStore, {
      selectedRoom: "selectedRoom",
      selectedUser: "selectedUser",
      totalItem: "totalItem",
      messages: "messages",
    }),
    ...mapState(useUserStore, {
      user: "user",
    }),
    ...mapState(useRoomStore, {
      roomSelected: "selectedRoom",
    }),
    isShowChatWindow() {
      if (this.selectedRoom == undefined && this.selectedUser == undefined) {
        return false;
      }
      return true;
    },
  },
  methods: {
    ...mapActions(useMessageStore, {
      fetchMessage: "fetchMessage",
    }),
    ...mapActions(useRoomStore, {
      leave: "leaveRoom",
    }),
    async mainScroll() {
      const main = document.getElementById("main-messages-container");
      if (main) {
        // console.log(
        //   "[>>>>]",
        //   e,
        //   main.scrollTop,
        //   main.scrollHeight,
        //   this.totalItem,
        //   this.messages.length
        // );
        if (main.scrollTop == 0 && this.totalItem > this.messages.length) {
          if (this.selectedRoom || this.selectedUser) {
            const data = await this.fetchMessage();
            console.log(data.totalCount);
            this.total = data.totalCount;
          }
        }
      }
    },
    async leaveRoom() {
      await this.leave();
    },
  },

  beforeRouteEnter(to, from, next) {
    console.log("[Dashboard] >>>", to, from);
    if (from.name == "UserProfile") {
      if (from.meta.isReady == true) {
        next();
      }
      return;
    }
    next();
  },
});
</script>

<style scoped lang="scss">
.grid-layout {
  display: grid;
  height: 100%;
  grid-template-areas:
    "header"
    "main"
    "footer";
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr 50px;
  transition: all 0.5s ease;
  background-image: url("@/assets/defaultbackground.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  overflow: hidden;
  header {
    grid-area: header;
    padding: 0 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--vt-c-divider-dark-1);
    background-color: var(--vt-c-black-soft);
    transition: all 0.4s ease;
    justify-content: space-between;
    .header-left {
      display: flex;
      gap: 10px;
      align-items: center;
      color: var(--vt-c-header-text-color);
      text-shadow: 0px 2px 5px var(--vt-c-header-text-shadow);
    }
    .icon {
      font-size: 1.5em;
    }
  }

  main {
    grid-area: main;
    overflow-y: scroll;
    transition: all 0.4s ease;
    position: relative;
  }

  aside {
    grid-area: sidebar;
    width: 200px;
    height: 100%;
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    padding: 0 5px;
    position: relative;
    transition: all 0.3s ease;
    overflow: visible;
    &.sidebar {
      background-color: var(--vt-c-navbar-bg-color);
      position: absolute;
      top: 0;
      right: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
      .open-sidebar-icon {
        position: absolute;
        right: 100%;
        top: 50%;
        height: 25px;
        aspect-ratio: 1 / 1;
        background-color: var(--color-background);
        transition: all 0.3s ease;

        :first-child {
          color: var(--color-text);
          height: 100%;
          aspect-ratio: 1 / 1;
        }
      }
    }
    &.active {
      transform: translateX(0);
    }
  }

  footer {
    grid-area: footer;
  }
}

.message {
  padding: 10px;
}

.message-slide-enter-active,
.message-slide-leave-active {
  transition: all 0.3s ease;
}

.message-slide-enter-from,
.message-slide-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

@media only screen and (min-width: 40em) {
  .grid-layout {
    grid-template-areas:
      "header sidebar"
      "main sidebar"
      "footer sidebar";
    grid-template-columns: 1fr 200px;
    grid-template-rows: 50px 1fr 50px;

    aside {
      &.sidebar {
        background-color: var(--vt-c-navbar-bg-color);
        position: absolute;
        top: 0;
        right: 0;
        transform: translateX(0);
        .open-sidebar-icon {
          display: none;
        }
      }
    }
  }
}
</style>
