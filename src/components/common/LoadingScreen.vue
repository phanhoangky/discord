<template>
  <Teleport to="#modal">
    <Transition name="scale">
      <div class="backdrop" v-if="isLoading">
        <div class="spinner">
          <div class="progress"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useLoadingScreenStore } from "@/stores/LoadingScreen";
export default defineComponent({
  setup() {
    return {};
  },
  computed: {
    ...mapState(useLoadingScreenStore, {
      isLoading: "isLoading",
    }),
  },
});
</script>

<style scoped lang="scss">
.backdrop {
  position: fixed;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(24, 24, 24, 0.3);
  justify-content: center;
  align-items: center;
  .spinner {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    background-color: rgba(24, 24, 24, 0);
    border-left: 10px solid var(--vt-c-blue-light-2);
    overflow: hidden;
    animation: spin 2s ease infinite;
    position: relative;
    .progress {
      position: absolute;
      height: 0;
      width: 100%;
      background-color: rgb(17, 148, 223);
      animation: flow 1s ease infinite;
    }
  }
}
.scale-enter-active,
.scale-leave-to {
  transition: all 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
@keyframes spin {
  from {
    transform: rotate(0deg);
    border-right: 0px solid var(--vt-c-blue-light-2);
    border-bottom: 0px solid var(--vt-c-blue-light-2);
    border-top: 0px solid var(--vt-c-blue-light-2);
  }
  to {
    transform: rotate(360deg);
    border-right: 10px solid var(--vt-c-blue-light-2);
    border-bottom: 10px solid var(--vt-c-blue-light-2);
    border-top: 10px solid var(--vt-c-blue-light-2);
  }
}
@keyframes flow {
  from {
    height: 0;
  }
  to {
    height: 100%;
  }
}
</style>
