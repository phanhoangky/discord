<template>
  <div v-if="isSucceed">Thank you for confirm email, you can log in now</div>
  <div v-if="isSucceed == false">Some error occured</div>
  <div v-if="isSucceed == undefined">Please wait</div>
  <router-link to="/sign-in">Click here</router-link>
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

<style scoped></style>
