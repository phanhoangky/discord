<template>
  <Teleport to="body">
    <div
      class="drawer-backdrop"
      :style="backdropStyle"
      @click.stop="$emit('close')"
    >
      <div class="drawer" :style="drawerStyle" @click.stop="() => {}">
        <header>
          <div class="icon click-ani button" @click.stop="$emit('close')">
            <font-awesome-icon icon="circle-xmark" class=""></font-awesome-icon>
          </div>
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
      position: relative;
      .icon {
        position: absolute;
        right: 5px;
        top: 5px;
        color: var(--vt-c-text-light-2);
        font-size: 1.5em;
        aspect-ratio: 1 / 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
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
