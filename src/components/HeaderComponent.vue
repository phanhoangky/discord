<template>
  <div class="container">
    <font-awesome-icon icon="user" class="hashtag"></font-awesome-icon>
    <font-awesome-icon icon="user"></font-awesome-icon>
    <font-awesome-icon icon="user"></font-awesome-icon>
  </div>
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
.container {
  display: flex;
  gap: 1em;
  justify-content: flex-end;
  .hashtag {
  }
}
</style>
