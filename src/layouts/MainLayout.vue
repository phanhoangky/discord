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
    <div
      class="open-menu-icon"
      :class="{
        active: isOpenSidebar,
      }"
      @click="isOpenSidebar = !isOpenSidebar"
    >
      <font-awesome-icon
        v-if="!isOpenSidebar"
        icon="caret-right"
      ></font-awesome-icon>
      <font-awesome-icon
        v-if="isOpenSidebar"
        icon="caret-left"
      ></font-awesome-icon>
    </div>
    <aside
      class="sidenav"
      :class="{
        active: isOpenSidebar,
      }"
    >
      <slot name="sidenav">
        <SideNavigation></SideNavigation>
      </slot>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNavigation from "../components/SideNavigation/SideNavigation.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
import { mapActions } from "pinia";
import useMessageStore from "@/stores/MessageStore";
import { CHAT_HUB_METHOD } from "@/stores/Constant";
import useInvitationStore from "@/stores/InvitationStore";
import { useRoomStore } from "@/stores/RoomStore";
import useUserStore from "@/stores/UserStore";

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
  data: () => ({
    isOpenSidebar: false,
  }),
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
    ...mapActions(useUserStore, {
      onUserOffline: "onUserOffline",
      onUserOnline: "onUserOnline",
    }),
  },
  created() {
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
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.ON_USER_OFFLINE}`,
      this.onUserOffline
    );
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.ON_USER_ONLINE}`,
      this.onUserOnline
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
  .open-menu-icon {
    display: flex;
    position: absolute;
    top: calc(50%);
    left: 0;
    font-size: large;
    transition: all 0.4s ease;
    background-color: var(--vt-c-drawer-bg);
    :first-child {
      height: 25px;
      aspect-ratio: 1 / 1;
      color: var(--color-text);
    }
    &.active {
      transform: translateX(150px);
    }
    &:hover {
      background-color: var(--vt-c-button-hover-bg);
      color: var(--vt-c-button-hover-text);
      box-shadow: 0px 0px 5px 5px var(--color-text);
    }
  }
  .sidenav {
    grid-area: sidenav;
    padding: 0;
    width: 150px;
    height: 100%;
    overflow: hidden;
    background-color: var(--vt-c-navbar-bg-color);
    // background-image: url("@/assets/background.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    color: var(--vt-c-navbar-text-color);
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    transform: translateX(-100%);
    top: 0;

    &.active {
      transform: translateX(0);
    }
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
    .open-menu-icon {
      display: none;
    }
    .sidenav {
      position: relative;
      width: 150px;
      padding: 0.5em;
      // height: auto;
      transform: translateX(0);
      border-left: 1px solid var(--vt-c-black);
    }

    .main {
      height: calc(100%);
    }
  }
}
</style>
