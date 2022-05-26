<template>
  <div class="container" id="container">
    <div @click="isShow = true">
      <slot> </slot>
    </div>
    <Transition name="fade">
      <div
        class="confirm__popup"
        id="confirmPopup"
        :class="isShow ? 'visible' : ''"
        ref="popup"
        v-if="isShow"
      >
        <header>
          {{ title }}
        </header>
        <footer>
          <button @click="isShow = false" class="cancel click-ani">
            <font-awesome-icon icon="circle-xmark"></font-awesome-icon>
          </button>
          <button
            @click="onConfirmAysnc"
            class="primary click-ani"
            v-if="confirmAsync"
          >
            <font-awesome-icon icon="circle-check"></font-awesome-icon>
          </button>
          <button @click="onConfirm" class="primary click-ani" v-if="confirm">
            <font-awesome-icon icon="circle-check"></font-awesome-icon>
          </button>
        </footer>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { useLoadingScreenStore } from "@/stores/LoadingScreen";
import { mapActions } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    confirmAsync: {
      type: Function,
      required: false,
    },
    confirm: {
      type: Function,
      required: false,
    },
  },
  // emits: ["confirm"],
  setup() {
    return {};
  },
  data: () => ({
    isShow: false,
  }),
  computed: {},
  methods: {
    ...mapActions(useLoadingScreenStore, {
      setLoadingScreen: "setIsLoading",
    }),
    onConfirm() {
      if (this.confirm) {
        this.confirm();
        this.isShow = false;
      }
    },
    async onConfirmAysnc() {
      if (this.confirmAsync) {
        await this.confirmAsync();
        this.isShow = false;
      }
    },
  },
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
  overflow: visible;
  :first-child {
    width: 100%;
  }

  .confirm__popup {
    position: absolute;
    z-index: 1000;
    border-radius: 10px;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    background-color: var(--vt-c-confirm-popup-bg);
    color: var(--vt-c-confirm-popup-text);
    padding: 10px;
    bottom: 110%;
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0px 0px 20px 5px var(--vt-c-blue-light-2);
    }

    footer {
      display: flex;
      gap: 10px;
      button {
        min-width: 50px;
      }
    }
  }
  .visible {
    // visibility: visible;
  }
  // &:hover .confirm__popup {
  //   visibility: visible;
  // }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(50px);
}
</style>
