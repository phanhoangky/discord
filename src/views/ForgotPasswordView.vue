<template>
  <div>
    <section>
      <form @submit="onSubmit">
        <fieldset>
          <label>
            <font-awesome-icon icon="lock"></font-awesome-icon>
          </label>
          <input type="text" name="email" v-model="email" />
          <span>{{ emailError }}</span>
        </fieldset>
        <button type="submit">Submit</button>
      </form>
    </section>
    <router-link to="sign-in">Back to login</router-link>
    <div v-if="isShow">
      Verify link has been sent to your mail, please check it to confirm
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

<style scoped></style>
