<template>
  <div class="reset-password-component-wrapper">
    <h1 class="title custom-test-shadow">Reset Password</h1>
    <section>
      <form @submit="onSubmit" class="reset-password-form">
        <fieldset class="field-group">
          <label class="field-label">
            <font-awesome-icon icon="lock"></font-awesome-icon>
          </label>
          <input
            autocomplete="additional-name"
            type="password"
            name="password"
            placeholder="New Password"
            v-model="password"
          />
        </fieldset>
        <span class="error-message">{{ passwordError }}</span>
        <fieldset class="field-group">
          <label class="field-label">
            <font-awesome-icon icon="lock"></font-awesome-icon>
          </label>
          <input
            autocomplete="additional-name"
            type="password"
            name="confirm"
            placeholder="Confirm New Password"
            v-model="confirm"
          />
        </fieldset>
        <span class="error-message">{{ confirmError }}</span>
        <button type="submit" class="click-ani primary">Submit</button>
      </form>
    </section>
  </div>
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
    .required()
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

<style scoped lang="scss">
.reset-password-component-wrapper {
  width: 100%;
  padding: 1em;
  background-color: var(--vt-c-divider-dark-1);
  border-radius: 10px;
  .title {
    text-align: center;
    color: var(--vt-c-blue-light-2);
    margin-bottom: 1em;
    text-shadow: 0px 0px 10px var(--vt-c-blue-light-2);
    font-weight: bolder;
  }
  section {
    width: 100%;
    form {
      display: flex;
      gap: 10px;
      &.reset-password-form {
        width: 100%;
        fieldset {
          border: none;
          display: flex;
        }
      }
    }
  }
}
@media only screen and (min-width: 40em) {
  .reset-password-component-wrapper {
    width: 60%;
  }
}
</style>
