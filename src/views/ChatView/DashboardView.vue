<template>
  <div class="grid-layout">
    <main class="main">
      <ListMessagesComponent></ListMessagesComponent>
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
export default defineComponent({
  setup() {
    return {};
  },
  components: {
    ListMessagesComponent,
    UsersInRoomComponent,
    ChatInputComponent,
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
  padding: 1em;
  transition: all 0.5s ease;
  main {
    grid-area: main;
  }
  aside {
    grid-area: sidebar;
    overflow: hidden;
    width: 0;
    height: 0;
  }
  footer {
    grid-area: footer;
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
      padding: 1em 0 1em 1em;
    }
  }
}
</style>
