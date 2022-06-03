<template>
  <Teleport to="body">
    <div
      class="drawer-backdrop"
      :style="backdropStyle"
      @click.stop="$emit('close')"
    >
      <div class="drawer" :style="drawerStyle" @click.stop="() => {}">
        <header>
          <slot name="header"></slot>
        </header>
        <main>
          <slot></slot>
        </main>
        <footer>
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
  emits: ["close"],
  props: {
    width: {
      type: String,
      required: true,
    },
    open: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    drawerStyle() {
      const translate = this.$props.open ? `translateX(0)` : `translateX(100%)`;
      return {
        width: this.$props.width,
        transform: translate,
      };
    },
    backdropStyle() {
      const bgColor = this.open ? `var(--vt-c-drawer-backdrop)` : `transparent`;
      return {
        backgroundColor: bgColor,
        zIndex: this.open ? 100 : -100,
      };
    },
  },
});
</script>

<style scoped lang="scss">
.drawer-backdrop {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: var(--vt-c-drawer-backdrop);
  transition: all 0.4s ease;
  overflow-x: hidden;
  .drawer {
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
    // transform: translateX(300px);
    height: 100vh;
    max-height: 100vh;
    background-color: var(--vt-c-drawer-bg);
    color: var(--vt-c-drawer-text);
    display: grid;
    grid-template-rows: 50px 1fr 50px;
    box-shadow: 0px 0px 20px 5px var(--vt-c-blue-light-2);
    transition: all 0.4s ease;
    header {
      height: 50px;
      border-bottom: 1px solid black;
    }
    main {
      padding: 5px;
    }
    footer {
      height: 50px;
      border-top: 1px solid black;
    }
  }
}
</style>
