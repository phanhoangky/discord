<template>
  <div class="grid-template">
    <header class="header">
      <slot name="header">
        <HeaderComponent></HeaderComponent>
      </slot>
    </header>
    <main class="main">
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

export default defineComponent({
  setup() {
    const messageStore = useMessageStore();
    // const unSub = messageStore.$onAction((context) => {
    //   console.log(">>>>>>", context);
    // });
    const userStore = useUserStore();

    messageStore.$subscribe(async (mutation, state) => {
      console.log("[Dashboard Subscribe] >>>", mutation, state);

      const events: DebuggerEvent[] = mutation.events as DebuggerEvent[];
      const mutates: DebuggerEvent[] =
        events &&
        events.filter(
          (e) =>
            (e.key === "selectedRoom" && e.newValue) ||
            (e.key === "selectedUser" && e.newValue)
        );
      const isMessageMutate = events.some((e) => e.key === "messages");
      console.log("[Events] >>> ", mutates, isMessageMutate);
      if (mutates.length == 0 && !isMessageMutate) {
        console.log("[UserInRoom] >>>", "All User", mutation);
        await userStore.fetchUsers();
      }
      const event = mutates[0];
      if (mutates.length > 0 && event) {
        /////
        if (!state.selectedRoom && !state.selectedUser) {
          console.log("[UserInRoom] >>>", "All User", mutation);
          await userStore.fetchUsers();
        }

        //
        if (event.newValue && state.selectedRoom) {
          console.log("[UserInRoom] >>>", "SelectedRoom", mutation);
          await userStore.fetchUsersInRoom();
        }
        ///////
        if (event.newValue) {
          console.log("[Dashboard Subscribe]", mutation, state);
          messageStore.totalItem = 0;
          // messageStore.messages = [];
          messageStore.$patch({
            messages: [],
          });
          await messageStore.fetchMessage();
        }
      }
    });
    return {};
  },
  methods: {
    ...mapActions(useMessageStore, {
      receiveMessage: "receiveMessage",
      receiveGroupMessage: "receiveGroupMessage",
    }),
    ...mapActions(useInvitationStore, {
      receiveInvitation: "receiveInvitation",
    }),
  },
  created() {
    console.log("Main Layout [Created]");
    this.$chatHub.start();
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.RECEIVE_MESSAGE}`,
      this.receiveMessage
    );
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.RECEIVE_INVITATION}`,
      this.receiveInvitation
    );
    this.$chatHub.client.on(
      `${CHAT_HUB_METHOD.RECEIVE_GROUP_MESSAGE}`,
      this.receiveGroupMessage
    );
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
