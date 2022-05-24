<script lang="ts">
import { defineComponent } from "vue";
// import { RouterView } from "vue-router";
import AuthLayout from "./layouts/AuthLayout.vue";
import MainLayout from "./layouts/MainLayout.vue";
import LoadingScreen from "./components/common/LoadingScreen.vue";
import { mapState } from "pinia";
import { useLoadingScreenStore } from "./stores/LoadingScreen";
import { useToastMessageStore } from "./stores/ToastMessage";
import ToastMessage from "./components/common/ToastMessage.vue";
export default defineComponent({
  components: {
    AuthLayout,
    MainLayout,
    LoadingScreen,
    ToastMessage,
  },
  computed: {
    ...mapState(useLoadingScreenStore, {
      isLoading: "isLoading",
    }),
    ...mapState(useToastMessageStore, {
      isShow: "isShow",
    }),
  },
});
</script>

<template>
  <Transition name="slide">
    <component :is="$route.meta.layout">
      <router-view v-slot="{ Component }">
        <Transition name="slide" mode="out-in">
          <component :is="Component"></component>
        </Transition>
      </router-view>
    </component>
  </Transition>
  <LoadingScreen></LoadingScreen>
  <ToastMessage></ToastMessage>
</template>

<style lang="scss">
@import "@/assets/base.css";
@import "@/assets/styles.scss";
#app {
  margin: 0 auto;
}
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(-150px);
}
</style>
