<template>
  <section class="invitation">
    <header>
      <h3>Test 1</h3>
    </header>
    <aside>
      <img src="@/assets/logo.svg" />
    </aside>
    <main>
      <button class="click-ani">Accept</button>
      <button class="click-ani">Decline</button>
    </main>
  </section>
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
.invitation {
  display: grid;
  grid-template-columns: 30% 1fr;
  grid-template-areas:
    "aside header"
    "aside main";
  background-color: var(--vt-c-list-item-bg);
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 10px;
  gap: 10px;
  &:hover {
    background-color: var(--vt-c-list-item-bg-hover);
  }
  header {
    grid-area: header;
  }
  main {
    grid-area: main;
    display: flex;
    gap: 10px;
  }
  aside {
    grid-area: aside;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      aspect-ratio: 1 / 1;
    }
  }
}
</style>
