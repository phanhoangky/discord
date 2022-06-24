<template>
  <section>
    <form @submit="onSubmit">
      <fieldset class="field-group">
        <label>
          <font-awesome-icon icon="lock"></font-awesome-icon>
        </label>
        <input type="password" name="password" v-model="password" />
        <span>{{ passwordError }}</span>
      </fieldset>
      <fieldset class="field-group">
        <label>
          <font-awesome-icon icon="lock"></font-awesome-icon>
        </label>
        <input type="password" name="confirm" v-model="confirm" />
        <span>{{ confirmError }}</span>
      </fieldset>
      <button type="submit">Submit</button>
    </form>
  </section>
</template>

<script setup lang="ts">
import router from "@/router";
import useAuthenticateStore from "@/stores/AuthenticateStore";
import type { ResetPasswordRequest } from "@/stores/models/Authenticate";
import { MESSAGE_TYPE, useToastMessageStore } from "@/stores/ToastMessage";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

//Store
const authenticateStore = useAuthenticateStore();
const toastStore = useToastMessageStore();
//State
const schema = yup.object({
  password: yup.string().required().min(8),
  confirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password must match"),
});

//Method
const { handleSubmit } = useForm({
  validationSchema: schema,
});
const { value: password, errorMessage: passwordError } = useField("password");
const { value: confirm, errorMessage: confirmError } = useField("confirm");
const onSubmit = handleSubmit(async (values) => {
  const query = router.currentRoute.value.query;
  console.log(values, query, router.currentRoute.value);

  if (query && query.email && query.token) {
    const request: ResetPasswordRequest = {
      confirmPassword: confirm.value as string,
      email: query.email.toString(),
      password: password.value as string,
      token: query.token.toString(),
      isLoading: true,
      isNotify: true,
    };
    await authenticateStore.resetPassword(request);
    router.push({ name: "SignIn" });
    return;
  }
  toastStore.setToast(`${MESSAGE_TYPE.ERROR}`, "Error", "");
});
</script>

<style scoped></style>
