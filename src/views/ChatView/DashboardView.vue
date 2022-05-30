<template>
  <div class="grid-layout">
    <main class="main">
      <Transition>
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
import { defineComponent } from "vue";
import ListMessagesComponent from "./components/ListMessagesComponent.vue";
import UsersInRoomComponent from "./components/UsersInRoomComponent.vue";
import ChatInputComponent from "./components/ChatInputComponent.vue";
import { mapActions, mapState } from "pinia";
import useMessageStore from "@/stores/MessageStore";
export default defineComponent({
  setup() {
    const messageStore = useMessageStore();
    messageStore.$subscribe((mutation, state) => {
      console.log(mutation, state);
      console.log(
        mutation.events.key === "selectedUser",
        mutation.events.key === "selectedRoom"
      );
      if (
        mutation.events.key === "selectedUser" ||
        mutation.events.key === "selectedRoom"
      ) {
        messageStore.fetchMessage();
      }
    });
    return {};
  },
  components: {
    ListMessagesComponent,
    UsersInRoomComponent,
    ChatInputComponent,
  },
  computed: {
    ...mapState(useMessageStore, {
      selectedRoom: "selectedRoom",
      selectedUser: "selectedUser",
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
  },
  mounted() {
    console.log("[Dashboard] >>> start", this.$chatHub);
  },
});
</script>

<style scoped lang="scss">
.grid-layout {
  display: grid;
  height: 100%;
  grid-template-areas:
    "main"
    "footer";
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 50px;
  transition: all 0.5s ease;
  main {
    grid-area: main;
    overflow-y: scroll;
    img {
      width: 100%;
      height: 100%;
    }
  }
  aside {
    grid-area: sidebar;
    width: 0;
    height: 0;
    &.sidebar {
      background-color: var(--vt-c-navbar-bg-color);
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }
  footer {
    grid-area: footer;
    display: flex;
    padding: 5px;
  }
}
.message {
  padding: 10px;
}
@media only screen and (min-width: 40em) {
  .grid-layout {
    grid-template-areas:
      "main sidebar"
      "footer sidebar";
    grid-template-columns: 1fr 200px;
    grid-template-rows: 1fr 50px;
    aside {
      width: 200px;
      height: auto;
      padding-left: 10px;
    }
  }
}
</style>
