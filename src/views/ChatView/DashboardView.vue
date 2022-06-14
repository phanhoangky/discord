<template>
  <div class="grid-layout">
    <header>
      <div class="header-left">
        <InviteUsersModal v-if="selectedRoom"></InviteUsersModal>
        <EditRoomModal></EditRoomModal>
        <span>#</span>
        <span v-if="selectedRoom">{{ selectedRoom.name }}</span>
        <span v-if="selectedUser">
          {{ selectedUser.firstName }} {{ selectedUser.lastName }}
        </span>
      </div>
      <div v-if="selectedRoom">
        <ConfirmPopup :title="`Do you want to leave ?`" below center>
          <button class="click-ani">
            <font-awesome-icon icon="tent-arrow-turn-left"></font-awesome-icon>
          </button>
        </ConfirmPopup>
      </div>
    </header>
    <main class="main" id="main" ref="main" @scroll="mainScroll">
      <Transition name="message-slide">
        <ListMessagesComponent v-if="isShowChatWindow"></ListMessagesComponent>
        <img src="@/assets/defaultbackground.jpg" v-else />
      </Transition>
    </main>
    <aside class="sidebar">
      <UsersInRoomComponent></UsersInRoomComponent>
    </aside>
    <footer class="footer">
      <ChatInputComponent></ChatInputComponent>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, type DebuggerEvent } from "vue";
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
import SkeletonLoading from "@/components/common/SkeletonLoading.vue";
export default defineComponent({
  setup() {
    const invitationStore = useInvitationStore();
    const messageStore = useMessageStore();
    // await messageStore.fetchMessage();
    messageStore.$subscribe((mutation, state) => {
      console.log(mutation);
      const events = mutation.events as DebuggerEvent[];
      const messagesMutation = events.filter((e) => e.key == "messages");
      if (messagesMutation.length > 0) {
        nextTick(() => {
          const messagesListElement = document.getElementById(
            "main"
          ) as HTMLElement;
          console.log(
            messagesMutation,
            messagesListElement,
            messagesListElement.scrollTop,
            messagesListElement.scrollHeight
          );
          if (messagesListElement) {
            messagesListElement.scrollTo({
              top: messagesListElement.scrollHeight,
              behavior: "smooth",
            });
          }
        });
      }
    });
    onMounted(async () => {
      await invitationStore.fetchInvitationByUser();
    });

    return {};
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
    async mainScroll(e: UIEvent) {
      const main = document.getElementById("main");
      if (main) {
        const bottomOfWindow =
          Math.ceil(main.scrollTop) + main.clientHeight === main.scrollHeight;
        console.log(
          "[>>>>]",
          main.scrollTop,
          this.totalItem,
          this.messages.length
        );
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

  header {
    grid-area: header;
    padding: 0 5px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--vt-c-blue-light-2);
    transition: all 0.4s ease;
    justify-content: space-between;
    .header-left {
      display: flex;
      gap: 10px;
      align-items: center;
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

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }
  }

  aside {
    grid-area: sidebar;
    width: 0;
    height: 0;
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    padding: 0 5px;

    &.sidebar {
      background-color: var(--vt-c-navbar-bg-color);
      // overflow-y: scroll;
      // overflow-x: hidden;
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
      width: 200px;
      height: auto;
    }
  }
}
</style>
