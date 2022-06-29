<template>
  <div class="message-loading-wrapper" id="message-loading-wrapper">
    <section class="message">
      <header>
        <div class="username"></div>
      </header>
      <aside>
        <div class="image"></div>
      </aside>
      <main>
        <div class="message-content"></div>
        <div class="message-content"></div>
        <div class="message-content"></div>
      </main>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.message-loading-wrapper {
  min-height: 100px;
  height: fit-content;
  .message {
    display: grid;
    grid-template-areas:
      "sidebar header"
      "sidebar main";
    grid-template-columns: 50px 1fr;
    grid-template-rows: 50px 1fr;
    height: fit-content;
    border-bottom: 1px solid black;
    border-radius: 10px;
    padding: 1em;
    margin: 1em 0;
    transition: all 0.5s ease;

    &:hover {
      background-color: var(--vt-c-message-hover-bg);
      color: var(--vt-c-message-hover-text);
    }
    header {
      .username {
        height: 25px;
        border-radius: 9999px;
        width: 50%;
        background-color: var(--vt-c-white-grey);
        animation: loading 2s linear infinite;
      }
    }
    aside {
      grid-area: sidebar;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-right: 10px;
      .image {
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        background-color: var(--vt-c-white-grey);
        animation: loading 2s linear infinite;
      }
    }
    main {
      grid-area: main;
      // padding: 1em 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      .message-content {
        width: 100%;
        height: 20px;
        background-color: var(--vt-c-white-grey);
        border-radius: 9999px;
        animation: loading 2s linear infinite;
      }
    }
  }
}

@keyframes loading {
  0% {
    background-color: rgba(255, 255, 255, 0.6);
  }
  50% {
    background-color: rgba(136, 136, 136, 0.8);
  }
  75% {
    background-color: rgb(45, 45, 45);
  }
  100% {
    background-color: rgba(255, 255, 255, 0.6);
  }
}

@media only screen and (min-width: 40em) {
}
</style>
