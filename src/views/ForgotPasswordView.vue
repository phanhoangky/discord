<template>
  <div class="forgot-password-component-wrapper">
    <h1 class="title custom-text-shadow">Forgot Password</h1>
    <section>
      <form @submit="onSubmit" class="forgot-password-form">
        <fieldset class="field-group">
          <label class="field-label">
            <font-awesome-icon icon="lock"></font-awesome-icon>
          </label>
          <input
            type="text"
            placeholder="Email........."
            name="email"
            v-model="email"
          />
        </fieldset>
        <span class="error-message">{{ emailError }}</span>
        <button type="submit" class="click-ani primary">Submit</button>
      </form>
    </section>
    <router-link class="custom-text-shadow" to="sign-in"
      >Back to login</router-link
    >
    <div class="verify-link-notify" v-if="isShow">
      Verify link has been sent to your mail, please check it to confirm (if you
      don't see email, try to check in spam folder)
    </div>
  </div>
</template>

<script setup lang="ts">
import useAuthenticateStore from "@/stores/AuthenticateStore";
import { MESSAGE_TYPE, useToastMessageStore } from "@/stores/ToastMessage";
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import * as yup from "yup";
//Store
const authenticateStore = useAuthenticateStore();
const toastStore = useToastMessageStore();
//State
let isShow = ref(false);
const schema = yup.object({
  email: yup.string().required().email(),
});
//Method
const { handleSubmit } = useForm({
  validationSchema: schema,
});
const { value: email, errorMessage: emailError } = useField("email");
const onSubmit = handleSubmit(async (values) => {
  console.log(values);
  if (!values.email) {
    toastStore.setToast(`${MESSAGE_TYPE.ERROR}`, "Error", "");
  }
  if (values.email) {
    await authenticateStore.forgotPassword(values.email);
    isShow.value = true;
  }
});
//
</script>

<style scoped lang="scss">
.forgot-password-component-wrapper {
  width: 100%;
  background-color: var(--vt-c-divider-dark-1);
  padding: 1em;
  border-radius: 10px;
  .title {
    text-align: center;
    color: var(--vt-c-blue-light-2);
    margin-bottom: 1em;
    font-weight: bolder;
  }
  section {
    form {
      &.forgot-password-form {
        width: 100%;
        display: flex;
        gap: 10px;
        fieldset {
          display: flex;
        }
      }
      // input {
      //   border-top-left-radius: 10px;
      //   border-bottom-left-radius: 10px;
      // }
    }
  }
  .verify-link-notify {
    font-size: large;
    font-weight: bold;
  }
  a {
    text-decoration: underline;
    color: var(--vt-c-white);
  }
}

@media only screen and (min-width: 40em) {
  .forgot-password-component-wrapper {
    width: 60%;
  }
}
</style>
