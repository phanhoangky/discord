<template>
  <section class="message" v-for="item in listUser" :key="item.id">
    <header class="header">
      <span class="username">{{ item.name }}</span> |
      <span>{{ item.date }}</span>
    </header>
    <aside class="avatar">
      <img src="@/assets/logo.svg" />
    </aside>
    <main class="message-content">
      {{ item.content }}
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Message } from "@/stores/models/Message";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  data: () => ({
    users: [],
  }),
  computed: {
    listUser(): Message[] {
      return [
        {
          id: uuidv4(),
          photoURL: "",
          content: "Hi there i'm PHK",
          date: new Date().getDate(),
          name: "PHK",
        },
        {
          id: uuidv4(),
          photoURL: "",
          content: "Hello i'm FBK",
          date: new Date().getDate(),
          name: "FBK",
        },
      ];
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
section {
  display: grid;
  grid-template-areas:
    "sidebar header"
    "sidebar main";
  grid-template-columns: 50px 1fr;
  height: fit-content;
  border-bottom: 1px solid black;
  border-radius: 10px;
  padding: 1em;
  margin: 1em 0;
  transition: all 0.5s ease;
  &:hover {
    background-color: var(--vt-c-divider-dark-2);
  }
  aside {
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 10px;
    overflow: hidden;
    &.avatar {
      border-radius: 10px;
    }
    img {
      width: 100%;
      aspect-ratio: 1 /1;
    }
  }
  main {
    grid-area: main;
    padding: 1em 0;
  }
  header {
    grid-area: header;
    .username {
      font-weight: bolder;
      font-size: 1.2em;
    }
  }
}

@media only screen and (min-width: 40em) {
}
</style>
