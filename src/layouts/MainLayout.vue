<template>
  <div class="grid-template">
    <header class="header">
      <slot name="header"> <HeaderComponent></HeaderComponent> </slot>
    </header>
    <main class="main">
      <slot>
        <router-view v-slot="{ Component }">
          <Transition name="slide" mode="out-in">
            <component :is="Component"></component>
          </Transition>
        </router-view>
      </slot>
    </main>
    <!-- <footer class="footer">
      <slot name="footer"></slot>
    </footer> -->
    <aside class="sidenav">
      <slot name="sidenav">
        <SideNavigation></SideNavigation>
      </slot>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNavigation from "../components/SideNavigation/SideNavigation.vue";
import HeaderComponent from "../components/HeaderComponent.vue";
import { mapActions } from "pinia";
import useMessageStore from "@/stores/MessageStore";

export default defineComponent({
  setup() {
    return {};
  },
  methods: {
    ...mapActions(useMessageStore, {
      receiveMessage: "receiveMessage",
    }),
  },
  created() {
    console.log("Main Layout [Created]");
    this.$chatHub.start();
    this.$chatHub.client.on("ReceiveMessage", this.receiveMessage);
  },
  components: { SideNavigation, HeaderComponent },
});
</script>

<style scoped lang="scss">
.grid-template {
  grid-template-areas:
    "header"
    "main";
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr;
  height: 100vh;
}

.header {
  grid-area: header;
  height: 50px;
  // padding: 1em;
  background-color: var(--vt-c-header-bg-color);
  color: var(--vt-c-header-text-color);
}
.main {
  grid-area: main;
  max-height: calc(100%);
  overflow-y: hidden;
}
.footer {
  grid-area: footer;
  background-color: var(--vt-c-divider-light-1);
}
.sidenav {
  grid-area: sidenav;
  padding: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  background-color: var(--vt-c-navbar-bg-color);
  color: var(--vt-c-navbar-text-color);
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

@media only screen and (min-width: 40em) {
  .grid-template {
    display: grid;
    grid-template-areas:
      "sidenav header"
      "sidenav main";
    grid-template-columns: 150px 1fr;
  }
  .sidenav {
    position: relative;
    width: 150px;
    padding: 0.5em;
    height: auto;
    border-left: 1px solid var(--vt-c-black);
  }
}
</style>
