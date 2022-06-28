<template>
  <div class="confirm-email-wrapper">
    <header class="title custom-test-shadow">
      <font-awesome-icon
        class="icon shadow"
        icon="box-archive"
      ></font-awesome-icon>
      <font-awesome-icon class="icon" icon="caret-right"></font-awesome-icon>
      <font-awesome-icon
        class="icon shadow"
        icon="truck-arrow-right"
      ></font-awesome-icon>
      <font-awesome-icon
        class="icon"
        icon="arrow-circle-right"
      ></font-awesome-icon>
      <font-awesome-icon class="icon" icon="caret-right"></font-awesome-icon>
      <font-awesome-icon
        class="icon shadow"
        icon="envelope-circle-check"
      ></font-awesome-icon>
    </header>
    <div class="confirm-content">
      Confirm Email has been sent to your email, please check it
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.confirm-email-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .title {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    font-weight: bolder;
    .icon {
      color: var(--color-text);
      font-size: 3em;
    }
  }
  .confirm-content {
    text-align: center;
    font-size: large;
    color: var(--vt-c-blue-light-2);
    text-shadow: 2px 2px 5px var(--vt-c-blue-light-2),
      2px 2px 5px var(--vt-c-black-mute), -2px -2px 5px var(--vt-c-black-mute),
      2px -2px 5px var(--vt-c-black-mute);
  }
}
@media only screen and (min-width: 40em) {
  .confirm-email-wrapper {
    width: 60%;
  }
}
</style>
