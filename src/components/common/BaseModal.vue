<template>
  <Teleport to="#modal">
    <Transition name="scale">
      <div class="modal-backdrop" v-if="show" @click.stop="$emit('close')">
        <div
          class="modal"
          :style="{
            width: width ? width : '',
          }"
          @click.stop="() => {}"
        >
          <header>
            <slot name="header">
              <span>{{ modalName }}</span>
              <font-awesome-icon
                icon="rectangle-xmark"
                class="close-icon click-ani"
                @click="$emit('close')"
              />
            </slot>
          </header>
          <main>
            <slot></slot>
          </main>
          <footer>
            <slot name="footer">
              <button class="cancel-btn cancel" @click.stop="$emit('close')">
                <slot name="cancel-button"> Cancel </slot>
              </button>
              <button class="submit-btn primary" @click="$emit('submit')">
                <slot name="submit-button"> Submit </slot>
              </button>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modalName: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: false,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close", "submit"],
  setup() {
    return {};
  },
  computed: {
    modalClassStyle() {
      return ``;
    },
  },
  methods: {},
});
</script>

<style scoped lang="scss">
.modal-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  z-index: 99;
  background-color: rgba(25, 24, 25, 0.5);
  border-radius: 1em;
  .modal {
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    z-index: 100;
    border-radius: 10px;
    box-shadow: 0px 0px 20px 5px var(--vt-c-white-soft);
    background-color: var(--vt-c-modal-bg);
    color: var(--vt-c-modal-text);
    header {
      border-bottom: 2px solid rgb(25, 25, 25);
      align-items: center;
      position: relative;
      padding: 1em;
      font-size: 1.2em;
      font-weight: bolder;

      .close-icon {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 1.5em;
        &:hover {
          box-shadow: 0px 0px 10px 5px;
        }
      }
    }
    main {
      display: flex;
      padding: 1em;
    }
    footer {
      display: flex;
      justify-content: flex-end;
      padding: 10px;
      gap: 10px;
      align-items: center;
      border-top: 2px solid rgb(25, 25, 25);
    }
  }
}
.scale-enter-active,
.scale-leave-active {
  transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
@media only screen and (min-width: 40em) {
  .modal-backdrop {
    .modal {
      width: 60%;
    }
  }
}
</style>
