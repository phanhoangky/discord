<template>
  <div class="confirm-popup-body-wrapper" ref="popupBody" id="popupBody">
    <header>
      {{ title }}
    </header>
    <footer>
      <button
        @click="
          () => {
            $emit('close');
          }
        "
        class="cancel click-ani"
      >
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
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import { useClickOutSide } from "./common";

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
  emits: ["confirm", "confirmAsync", "close"],
  setup(props, context) {
    let popupBody = ref();
    // useClickOutSide("popupBody", () => {
    //   context.emit("close");
    // });
    const listener = (event: MouseEvent) => {
      if (popupBody.value.contains(event.target)) {
        return;
      }
      context.emit("close");
    };

    onMounted(() => {
      window.addEventListener("mousedown", listener);
    });

    onBeforeUnmount(() => {
      console.log("[Unmount]: Click");

      window.removeEventListener("mousedown", listener);
    });
    return { popupBody };
  },
  data: () => ({
    isShow: false,
  }),
  methods: {
    onConfirm() {
      if (this.confirm) {
        this.confirm();
        this.$emit("close");
      }
    },
    async onConfirmAysnc() {
      if (this.confirmAsync) {
        await this.confirmAsync();
        this.$emit("close");
      }
    },
  },
});
</script>

<style scoped lang="scss">
.confirm-popup-body-wrapper {
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
</style>
