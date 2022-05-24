<template>
  <section v-for="user in listUsers" :key="user.id">
    <img src="@/assets/logo.svg" />
    <div class="username">{{ user.name }}</div>
  </section>
</template>

<script lang="ts">
import type { User } from "@/stores/models/User";
import { defineComponent } from "vue";
import { v4 as uuidv4 } from "uuid";

export default defineComponent({
  setup() {
    return {};
  },
  computed: {
    listUsers(): User[] {
      return [
        { id: uuidv4(), name: "Hash Tag 1", photoUrl: "" },
        { id: uuidv4(), name: "Hash Tag 2", photoUrl: "" },
      ];
    },
  },
});
</script>

<style scoped lang="scss">
section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em 0;
  transition: all 0.5s ease;
  border-radius: 10px;
  &:hover {
    background-color: var(--vt-c-divider-dark-2);
  }
  img {
    width: 30%;
    aspect-ratio: 1 / 1;
    flex-grow: 1;
    flex-shrink: 0;
  }
  .username {
    flex-grow: 8;
  }
}
</style>
