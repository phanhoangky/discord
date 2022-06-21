<template>
  <TransitionGroup name="list" tag="div" id="messages-list">
    <section
      class="message"
      v-for="item in messages"
      :key="item.id"
      :class="{
        sender: item.senderId == user?.id,
      }"
    >
      <header class="header">
        <span class="username"
          >{{ item.sender.firstName }} {{ item.sender.lastName }}</span
        >
        |
        <span>{{ new Date(item.createdTime) }} </span>
      </header>
      <aside class="avatar">
        <img
          :src="
            item.sender.photoUrl != '' ? item.sender.photoUrl : defaultAvatarURL
          "
        />
      </aside>
      <main class="message-content">
        <img
          v-if="
            item.file?.filePath != '' &&
            item.file?.type &&
            item.file.type.includes('image')
          "
          :src="item.file?.filePath"
        />
        <div v-else>
          <a :href="item.file?.filePath" target="_blank">{{
            item.file?.name
          }}</a>
        </div>
        <br />
        {{ item.messageContent }}
      </main>
    </section>
  </TransitionGroup>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, type DebuggerEvent } from "vue";
import { mapActions, mapState } from "pinia";
import useMessageStore from "@/stores/MessageStore";
import useUserStore from "@/stores/UserStore";
export default defineComponent({
  setup() {
    const messageStore = useMessageStore();

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
    ...mapState(useUserStore, {
      user: "user",
    }),
    defaultAvatarURL() {
      const url = new URL("../../../assets/defaultuser.png", import.meta.url);
      return url.toString();
    },
  },
  methods: {},
});
</script>

<style scoped lang="scss">
section {
  &.sender {
    background-color: var(--vt-c-blue-light-2);
  }
  &.message {
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
      &.message-content {
        img {
          max-width: 50%;
        }
      }
    }
    header {
      grid-area: header;
      .username {
        font-weight: bolder;
        font-size: 1.2em;
      }
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
