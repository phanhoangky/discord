<template>
  <div class="container" id="container">
    <div @click="isShow = true">
      <slot> </slot>
    </div>
    <Transition name="fade">
      <!-- <div
        class="confirm__popup"
        id="confirmPopup"
        :class="{
          visible: isShow,
          below: below,
          'align-with-right-border': alignRight,
          center: center,
        }"
        :style="{
          width: width ? width : '200px',
        }"
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
      </div> -->
      <ConfirmPopupComponent
        :title="title"
        class="confirm__popup"
        id="confirmPopup"
        :class="{
          visible: isShow,
          below: below,
          'align-with-right-border': alignRight,
          center: center,
        }"
        :style="{
          width: width ? width : '200px',
        }"
        ref="popup"
        @close="isShow = false"
        v-if="isShow"
        :confirm="confirm"
        :confirm-async="confirmAsync"
      >
      </ConfirmPopupComponent>
    </Transition>
  </div>
</template>

<script lang="ts">
import { useLoadingScreenStore } from "@/stores/LoadingScreen";
import { mapActions } from "pinia";
import { defineComponent, nextTick, ref, watch } from "vue";
import ConfirmPopupComponent from "./ConfirmPopupComponent.vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: false,
    },
    confirmAsync: {
      type: Function,
      required: false,
    },
    confirm: {
      type: Function,
      required: false,
    },
    below: {
      type: Boolean,
      required: false,
    },
    alignRight: {
      type: Boolean,
      required: false,
    },
    center: {
      type: Boolean,
      required: false,
    },
  },
  // emits: ["confirm"],
  setup() {
    const isShow = ref(false);
    //Method
    return {
      isShow,
    };
  },
  data: () => ({
    // isShow: false,
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
  components: { ConfirmPopupComponent },
});
</script>

<style scoped lang="scss">
.container {
  position: relative;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-items: center;
  > div {
    width: 100%;
  }

  .confirm__popup {
    position: absolute;
    z-index: 1000;
    border-radius: 10px;
    width: auto;
    text-align: center;
    background-color: var(--vt-c-confirm-popup-bg);
    color: var(--vt-c-confirm-popup-text);
    padding: 10px;
    bottom: 110%;
    box-shadow: 0px 0px 20px 5px var(--vt-c-black-soft);
    transition: all 0.3s ease;
    &.center {
      left: 50%;
      transform: translateX(-50%);
    }
    &.top {
      bottom: 110%;
    }
    &.below {
      top: 110%;
      bottom: auto;
    }
    &.align-with-right-border {
      right: 0;
      left: auto;
    }
    &:hover {
      box-shadow: 0px 0px 20px 5px var(--vt-c-blue-light-2);
    }
    header {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    footer {
      display: flex;
      gap: 10px;
      justify-content: space-evenly;
      button {
        min-width: 50px;
      }
    }
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
  transform: translateY(-50px);
}
</style>
