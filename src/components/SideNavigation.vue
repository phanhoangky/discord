<template>
  <div class="logo">
    <img src="@/assets/logo.svg" />
  </div>
  <ul class="menu-container">
    <router-link class="menu-item" to="/">Home</router-link>
    <router-link class="menu-item" to="/Device">Device</router-link>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  background-color: var(--vt-c-divider-dark-1);
  border-radius: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  transition: all 0.5s ease;
  padding: 1em;
  img {
    width: 100%;
  }
  &:hover {
    background-color: var(--vt-c-blue-light-2);
    border-radius: 25%;
  }
}
.menu-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 5px;
  .menu-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    transition: all 0.5s ease;
    border-radius: 10px;
    margin-bottom: 5px;
    border-bottom: 1px solid var(--vt-c-white-soft);

    text-decoration: none;
    color: inherit;
    &:hover {
      background-color: var(--vt-c-indigo);
      border-top: 1px solid var(--vt-c-white-soft);
    }
  }
}
</style>
