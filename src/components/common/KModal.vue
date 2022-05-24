<template>
  <Teleport to="#modal">
    <Transition name="scale">
      <div class="modal-backdrop" v-if="show">
        <div class="modal">
          <header>
            <slot name="header">
              <span>{{ modalName }}</span>
              <font-awesome-icon
                icon="rectangle-xmark"
                class="close-icon click-ani"
              />
            </slot>
          </header>
          <main>
            <slot></slot>
          </main>
          <footer>
            <slot name="footer">
              <button class="cancel-btn cancel">
                <slot
                  name="cancel-button"
                  @click="
                    () => {
                      close();
                    }
                  "
                >
                  Cancel
                </slot>
              </button>
              <button class="submit-btn primary">
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
    close: {
      type: Function,
      required: true,
    },
    show: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    return {};
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
  background-color: rgba(25, 24, 25, 0);
  border-radius: 1em;
  .modal {
    display: flex;
    flex-direction: column;
    width: 60%;
    position: relative;
    z-index: 100;
    box-shadow: 5px 5px 20px 5px;
    background-color: var(--vt-c-divider-dark-1);
    header {
      border-bottom: 1px solid rgb(25, 25, 25);
      align-items: center;
      position: relative;
      padding: 1em;
      font-size: 1.2em;
      font-weight: bolder;
      color: var(--vt-c-title-color);
      .close-icon {
        position: absolute;
        color: var(--vt-c-white-soft);
        top: 5px;
        right: 5px;
        font-size: 1.5em;
        &:hover {
          box-shadow: 0px 0px 10px 5px;
        }
      }
    }
    main {
    }
    footer {
      display: flex;
      justify-content: flex-end;
      padding: 10px;
      align-items: center;
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
}
</style>
