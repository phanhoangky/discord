<template>
  <Teleport to="#modal">
    <Transition name="toast">
      <div class="backdrop" v-if="isShow">
        <div class="message">
          <div class="message__image">
            <font-awesome-icon
              class="icon"
              :icon="icon"
              :class="icon"
            ></font-awesome-icon>
          </div>
          <div class="message__infor">
            <h3>{{ header }}</h3>
            <hr />
            <span>{{ message }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { useToastMessageStore } from "@/stores/ToastMessage";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
  computed: {
    ...mapState(useToastMessageStore, {
      icon: "icon",
      isShow: "isShow",
      message: "message",
      header: "header",
    }),
  },
  methods: {
    ...mapActions(useToastMessageStore, {
      setToast: "setToast",
      setIsShow: "setIsShow",
    }),
  },
  watch: {
    isShow() {
      if (this.isShow == true) {
        setTimeout(() => {
          this.setIsShow(false);
        }, 2000);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(24, 24, 24, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 110;
  .message {
    width: 100%;
    position: relative;
    z-index: 110;
    background-color: var(--vt-c-black-soft);
    color: var(--vt-c-white-soft);
    display: flex;
    min-height: 100px;
    max-width: 500px;
    border-radius: 10px;
    overflow: hidden;
    padding: 1em;
    &__image {
      flex-grow: 1;
      flex-shrink: 0;
      padding: 1em;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      .icon {
        font-size: 2em;
      }
      img {
        border: 5px solid var(--vt-c-blue-light-2);
        border-radius: 50%;
        padding: 5px;
        background-color: aliceblue;
        aspect-ratio: 1 / 1;
      }
    }
    &__infor {
      flex-grow: 6;
    }
  }
}
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
.circle-xmark {
  color: var(--vt-c-text-error);
}
.circle-check {
  color: var(--vt-c-text-success);
}
.toast-warning {
}
.toast-success {
}
@media only screen and (min-width: 40em) {
  .backdrop {
    .message {
      width: 60%;
    }
  }
}
</style>
