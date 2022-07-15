<template>
  <section class="invitation">
    <header>
      <h3>{{ content }}</h3>
    </header>
    <aside>
      <div class="image-wrapper">
        <img :src="photoUrl != '' ? photoUrl : defaultAvatarURL" />
      </div>
    </aside>
    <main>
      <button class="click-ani primary" @click.stop="$emit('agree')">
        Accept
      </button>
      <button class="click-ani cancel" @click.stop="$emit('decline')">
        Decline
      </button>
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    content: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
  },
  emits: ["agree", "decline"],
  setup() {
    return {};
  },
  computed: {
    defaultAvatarURL() {
      const url = new URL("../../assets/defaultuser.png", import.meta.url);
      return url.toString();
    },
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
  box-shadow: 0px 2px 10px 2px var(--vt-c-black-soft);
  border: none;
  outline: none;
  &:hover {
    background-color: var(--vt-c-list-item-bg-hover);
    color: var(--vt-c-list-item-text-hover);
    // transform: skew(5deg);
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
    .image-wrapper {
      background-color: var(--color-background);
      aspect-ratio: 1 / 1;
      border-radius: 50%;
      img {
        aspect-ratio: 1 / 1;
        width: 100%;
        border-radius: 50%;
      }
    }
  }
}
</style>
