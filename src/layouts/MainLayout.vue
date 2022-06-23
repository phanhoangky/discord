<template>
  <div class="grid-template">
    <header class="header">
      <slot name="header">
        <HeaderComponent></HeaderComponent>
      </slot>
    </header>
    <main class="main" id="main-layout-content">
      <slot>
        <router-view v-slot="{ Component }">
          <Transition name="slide" mode="out-in">
            <component :is="Component"></component>
          </Transition>
        </router-view>
      </slot>
    </main>
    <!-- <footer class="footer">
      <slot name="footer"></slot>
    </footer> -->
    <aside class="sidenav">
      <slot name="sidenav">
        <SideNavigation></SideNavigation>
      </slot>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent, type DebuggerEvent } from "vue";
import SideNavigation from "../components/SideNavigation/SideNavigation.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
import { mapActions } from "pinia";
import useMessageStore from "@/stores/MessageStore";
import { CHAT_HUB_METHOD } from "@/stores/Constant";
import useInvitationStore from "@/stores/InvitationStore";
import useUserStore from "@/stores/UserStore";
import { useRoomStore } from "@/stores/RoomStore";

export default defineComponent({
  setup() {
    // const messageStore = useMessageStore();
    // const userStore = useUserStore();

    // messageStore.$onAction(async ({ name, after }) => {
    //   console.log("[Watch Action] >>>>", name);

    //   after(async () => {
    //     if (name == "setSelectedRoom") {
    //       await userStore.fetchUsersInRoom();
    //       return;
    //     }
    //   });
    // });
    return {};
  },
  methods: {
    ...mapActions(useMessageStore, {
      onReceivePrivateMessage: "onReceivePrivateMessage",
      receiveGroupMessage: "receiveGroupMessage",
      onSendMessage: "onSendMessage",
    }),
    ...mapActions(useInvitationStore, {
      receiveInvitation: "receiveInvitation",
      onInvitationAccepted: "onInvitationAccepted",
    }),
    ...mapActions(useRoomStore, {
      onOtherUserLeaveRoom: "onOtherUserLeaveRoom",
    }),
  },
  created() {
    console.log("Main Layout [Created]");
    this.$chatHub.start();
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.RECEIVE_MESSAGE}`,
      this.onReceivePrivateMessage
    );
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.SEND_MESSAGE}`,
      this.onSendMessage
    );
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.RECEIVE_INVITATION}`,
      this.receiveInvitation
    );
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.RECEIVE_GROUP_MESSAGE}`,
      this.receiveGroupMessage
    );
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.USER_LEAVE_GROUP}`,
      this.onOtherUserLeaveRoom
    );
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.INVITATION_ACCEPTED}`,
      this.onInvitationAccepted
    );
  },
  beforeUnmount() {
    this.$chatHub.end();
  },
  components: { SideNavigation, HeaderComponent },
});
</script>

<style scoped lang="scss">
.grid-template {
  grid-template-areas:
    "header"
    "main";
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr;
  height: 100vh;
  transition: all 0.4s ease;

  .header {
    grid-area: header;
    height: 50px;
    // padding: 1em;
    background-color: var(--vt-c-header-bg-color);
    color: var(--vt-c-header-text-color);
    border-bottom: 1px solid #292b30;
  }

  .main {
    grid-area: main;
    height: calc(100% - 50px);
    overflow-y: hidden;
    transition: all 0.4s ease;
  }

  .footer {
    grid-area: footer;
    background-color: var(--vt-c-divider-light-1);
    transition: all 0.4s ease;
  }

  .sidenav {
    grid-area: sidenav;
    padding: 0;
    width: 0;
    height: 100%;
    overflow: hidden;
    background-color: var(--vt-c-navbar-bg-color);
    color: var(--vt-c-navbar-text-color);
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@media only screen and (min-width: 40em) {
  .grid-template {
    display: grid;
    grid-template-areas:
      "sidenav header"
      "sidenav main";
    grid-template-columns: 150px 1fr;

    .sidenav {
      position: relative;
      width: 150px;
      padding: 0.5em;
      // height: auto;
      border-left: 1px solid var(--vt-c-black);
    }

    .main {
      height: calc(100%);
    }
  }
}
</style>
