<template>
  <div class="list-messages-component-wrapper">
    <TransitionGroup name="list" tag="div" id="messages-list">
      <section
        class="message"
        v-for="item in messages"
        :key="item.id"
        :class="{
          sender: item.senderId == user?.id,
          receive: item.senderId != user?.id,
        }"
      >
        <header class="header">
          <span class="username"
            >{{ item.sender.firstName }} {{ item.sender.lastName }}</span
          >
          |
          <span>{{ new Date(item.createdTime).toUTCString() }} </span>
        </header>
        <aside class="avatar">
          <div class="image-overlay">
            <img
              :src="
                item.sender.photoUrl != ''
                  ? item.sender.photoUrl
                  : defaultAvatarURL
              "
            />
          </div>
        </aside>
        <main class="message-content">
          <section
            class="message-attachment"
            v-if="item.file?.filePath != '' && item.file?.type"
          >
            <img
              v-if="item.file.type.includes('image')"
              :src="item.file?.filePath"
            />
            <div v-if="!item.file.type.includes('image')" class="message-file">
              <font-awesome-icon
                class="icon"
                icon="file-zipper"
              ></font-awesome-icon>
              <a :href="item.file?.filePath" target="_blank">{{
                item.file?.name
              }}</a>
            </div>
          </section>
          {{ item.messageContent }}
        </main>
      </section>
    </TransitionGroup>
    <Transition>
      <MessageLoadingComponent v-if="isLoading"></MessageLoadingComponent>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { mapState } from "pinia";
import useMessageStore from "@/stores/MessageStore";
import useUserStore from "@/stores/UserStore";
import MessageLoadingComponent from "./MessageLoadingComponent.vue";
export default defineComponent({
  setup() {
    //Store
    const messageStore = useMessageStore();
    //State
    const isLoading = ref(false);

    //Watchers for the message loading
    messageStore.$onAction(({ name }) => {
      if (name == "sendMessage") {
        isLoading.value = true;
        // after(() => {
        //   isLoading.value = false;
        // });
      }
      if (name == "onSendMessage" || name == "onReceivePrivateMessage") {
        isLoading.value = false;
      }
    });

    return { isLoading };
  },
  components: { MessageLoadingComponent },
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
.list-messages-component-wrapper {
  section {
    &.sender {
      background-color: var(--vt-c-send-message-bg);
      color: var(--vt-c-send-message-text);
    }
    &.receive {
      background-color: var(--vt-c-receive-message-bg);
      color: var(--vt-c-receive-message-text);
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
        background-color: var(--vt-c-message-hover-bg);
        color: var(--vt-c-message-hover-text);
      }
      aside {
        grid-area: sidebar;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 10px;
        &.avatar {
          border-radius: 10px;
          .image-overlay {
            background-color: var(--vt-c-white-mute);
            border-radius: 50%;
            aspect-ratio: 1 / 1;
            img {
              width: 100%;
              aspect-ratio: 1 /1;
              border-radius: 50%;
            }
          }
        }
      }
      main {
        grid-area: main;
        // padding: 1em 0;
        &.message-content {
          font-weight: bold;
          font-size: 1.1em;
          .message-attachment {
            // background-color: var(--vt-c-divider-dark-1);
            width: fit-content;
            padding: 1em 0;
            img {
              max-width: 50%;
            }
            .message-file {
              display: flex;
              gap: 10px;
              align-items: center;
              .icon {
                font-size: 2em;
              }
              a {
                text-decoration: underline;
                color: var(--vt-c-blue-light-2);
              }
            }
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
