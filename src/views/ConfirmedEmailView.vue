<template>
  <div class="confirmed-email-wrapper">
    <div class="title">
      <font-awesome-icon
        class="icon circle-check"
        icon="circle-check"
      ></font-awesome-icon>
    </div>
    <div v-if="isSucceed" class="result">
      Thank you for confirm email, you can log in now
    </div>
    <div v-if="isSucceed == false" class="result">Some error occured</div>
    <div v-if="isSucceed == undefined" class="result">Please wait</div>
    <router-link class="custom-text-shadow result" to="/sign-in"
      >Back to Login</router-link
    >
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import useAuthenticateStore from "@/stores/AuthenticateStore";
import type { VerifyEmailRequest } from "@/stores/models/Authenticate";
import router from "@/router";
const authenticateStore = useAuthenticateStore();
let isSucceed = ref(undefined);
onMounted(async () => {
  //

  console.log(
    router.currentRoute.value.fullPath,
    router.currentRoute.value.query,
    router.currentRoute.value.params
  );
  const query = router.currentRoute.value.query;
  if (query && query.email && query.token) {
    const request: VerifyEmailRequest = {
      email: query.email.toString(),
      token: query.token.toString(),
      isLoading: true,
      isNotify: true,
    };
    const data = await authenticateStore.verifyEmail(request);
    isSucceed.value = data;
  }
});
</script>

<style scoped lang="scss">
.confirmed-email-wrapper {
  width: 100%;
  padding: 1em;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bolder;

    .icon {
      font-size: 3em;
    }
  }
  .result {
    text-align: center;
    font-weight: bold;
  }
  a {
    color: var(--vt-c-white);
  }
}

@media only screen and (min-width: 40em) {
  .confirmed-email-wrapper {
    width: 60%;
  }
}
</style>
