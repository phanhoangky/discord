<template>
  <TransitionGroup name="list">
    <section class="message" v-for="item in messages" :key="item.id">
      <header class="header">
        <span class="username">{{ item.senderId }}</span> |
        <span>{{ item.id }}</span>
      </header>
      <aside class="avatar">
        <img src="@/assets/logo.svg" />
      </aside>
      <main class="message-content">
        {{ item.messageContent }}
      </main>
    </section>
  </TransitionGroup>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import useMessageStore from "@/stores/MessageStore";
export default defineComponent({
  setup() {
    return {};
  },
  components: {},
  data: () => ({
    users: [],
  }),
  computed: {
    ...mapState(useMessageStore, {
      messages: "messages",
    }),
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

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-leave-active {
  position: absolute;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media only screen and (min-width: 40em) {
}
</style>
