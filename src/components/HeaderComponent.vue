<template>
  <div class="container">
    <div class="user__profile header__item">
      <img src="@/assets/logo.svg" />
      <span>{{ user?.firstName }} {{ user?.lastName }}</span>
    </div>
    <div class="logout__icon icon header__item">
      <font-awesome-icon icon="dungeon"></font-awesome-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
  computed: {
    ...mapState(useUserStore, {
      user: "user",
    }),
  },
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  gap: 1em;
  justify-content: flex-end;
  height: 100%;

  .header__item {
    height: 100%;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    transition: all 0.3s ease;
    border-radius: 5px;
    min-width: 50px;
    img {
      box-sizing: initial;
      height: 50%;
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      padding: 4px;
      background-color: transparent;
      outline: var(--vt-c-blue-light-2) solid 4px;
    }
    &:hover {
      background-color: var(--vt-c-button-hover-bg);
      color: var(--vt-c-button-hover-text);
    }
  }
  .hashtag {
  }
}
</style>
