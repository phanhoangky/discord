<template>
  <div class="grid-template">
    <header class="header">
      <slot name="header"> <HeaderComponent></HeaderComponent> </slot>
    </header>
    <main class="main">
      <slot>
        <router-view></router-view>
      </slot>
    </main>
    <footer class="footer">
      <slot name="footer"></slot>
    </footer>
    <aside class="sidenav">
      <slot name="sidenav">
        <SideNavigation></SideNavigation>
      </slot>
    </aside>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SideNavigation from "../components/SideNavigation.vue";
import HeaderComponent from "../components/HeaderComponent.vue";

export default defineComponent({
  setup() {
    return {};
  },
  created() {
    console.log("Main Layout [Created]");
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
  padding: 1em;
}
.main {
  grid-area: main;
  height: calc(100% - 50px);
}
.footer {
  grid-area: footer;
}
.sidenav {
  grid-area: sidenav;
  padding: 0;
  width: 0;
  height: 0;
  overflow: hidden;
}

@media only screen and (min-width: 46.785em) {
  .grid-template {
    display: grid;
    grid-template-areas:
      "sidenav header"
      "sidenav main";
    grid-template-columns: 100px 1fr;
  }
  .sidenav {
    position: relative;
    width: 100px;
    padding: 0.5em;
    height: auto;
    border-left: 1px solid var(--vt-c-black);
  }
}
</style>
