<template>
  <div class="grid-container">
    <aside class="sidebar">
      <img src="@/assets/signInBg.svg" />
    </aside>
    <main class="main">
      <slot>
        <router-view></router-view>
      </slot>
    </main>
    <footer class="footer"></footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  created() {
    console.log("[Auth Layout Created]:");
  },
});
</script>

<style scoped lang="scss">
.grid-container {
  grid-template-areas:
    "main"
    "footer";
  grid-template-columns: 1fr;
  transition: all 0.5s ease;
  background-image: url("@/assets/wave.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.sidebar {
  grid-area: sidebar;
  overflow: hidden;
  img {
    height: 100%;
  }
}
.main {
  grid-area: main;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.footer {
  grid-area: footer;
}
@media only screen and (min-width: 40em) {
  .grid-container {
    height: 100vh;
    display: grid;
    grid-template-areas:
      "sidebar main"
      "footer footer";
    grid-template-columns: 1fr 1fr;
    .main {
      height: auto;
    }
  }
}
</style>
