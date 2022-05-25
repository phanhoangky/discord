<template>
  <div class="form-container">
    <Form class="form" @submit="onSubmit" :validation-schema="schema">
      <div class="form__field">
        <label for="email">
          <font-awesome-icon icon="user"></font-awesome-icon>
        </label>
        <Field
          class="username"
          name="firstname"
          id="firstname"
          placeholder="Firstname"
          style="margin-right: 1em"
        ></Field>
        <Field
          class="username"
          name="lastname"
          id="lastname"
          placeholder="Lastname"
          style="border-top-left-radius: 10px; border-bottom-left-radius: 10px"
        ></Field>
      </div>
      <ErrorMessage name="firstname" class="error-message"></ErrorMessage>
      <ErrorMessage name="lastname" class="error-message"></ErrorMessage>

      <div class="form__field">
        <label for="email">
          <font-awesome-icon icon="user"></font-awesome-icon>
        </label>
        <Field name="email" id="email" placeholder="Email"></Field>
      </div>
      <ErrorMessage name="email" class="error-message"></ErrorMessage>

      <div class="form__field">
        <label for="password">
          <font-awesome-icon icon="lock"></font-awesome-icon>
        </label>
        <Field
          type="password"
          name="password"
          id="password"
          placeholder="Password"
        ></Field>
      </div>
      <ErrorMessage name="password" class="error-message"></ErrorMessage>

      <div class="form__field">
        <label for="confirm-password">
          <font-awesome-icon icon="lock"></font-awesome-icon>
        </label>
        <Field
          name="confirmPw"
          type="password"
          id="confirm-password"
          placeholder="Confirm Password"
        ></Field>
      </div>
      <ErrorMessage name="confirmPw" class="error-message"></ErrorMessage>
      <button class="primary">Create</button>
      <hr />
      <router-link to="/sign-in">Already have an account ?</router-link>
    </Form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { mapActions } from "pinia";
import { useLoadingScreenStore } from "@/stores/LoadingScreen";
import * as yup from "yup";
import { useUserStore } from "@/stores/UserStore";

export default defineComponent({
  components: {
    ErrorMessage,
    Form,
    Field,
  },
  methods: {
    ...mapActions(useUserStore, {
      signUp: "SignUp",
    }),
    ...mapActions(useLoadingScreenStore, {
      setIsLoading: "setIsLoading",
    }),
    onSubmit(values: any): void {
      this.setIsLoading(true);
      this.signUp(values)
        .then(() => {
          this.setIsLoading(false);
        })
        .catch(() => {
          this.setIsLoading(false);
        });
    },
  },
  setup() {
    let schema = yup.object({
      email: yup.string().required().email().max(50),
      firstname: yup.string().required().max(50),
      lastname: yup.string().required().max(50),
      password: yup.string().required().max(50),
      confirmPw: yup
        .string()
        .oneOf([yup.ref("password"), null], "Password must match"),
    });
    return {
      schema,
    };
  },
});
</script>

<style scoped lang="scss">
.form-container {
  background-color: var(--vt-c-divider-light-1);
  padding: 1em;
  border-radius: 1em;
  width: 100%;
  transition: all 0.5s ease;
  .form {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    width: 100%;
    &__field {
      display: flex;
      margin-bottom: 1em;

      label {
        padding: 1em;
        background-color: var(--vt-c-black-mute);
        color: var(--vt-c-white);
        border-top-left-radius: 1em;
        border-bottom-left-radius: 1em;
      }
      input {
        padding: 1em;
        border: 0;
        outline: 0;
        width: 100%;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    }

    button {
      outline: 0;
      padding: 1em;
      border: 0;
      width: 100%;
      margin: 1em 0;
    }
    a {
      text-decoration: none;
      width: 100%;
      text-align: center;
      color: var(--vt-c-blue-light-1);
    }
  }
}
@media only screen and (min-width: 40em) {
  .form-container {
    width: 60%;
  }
}
</style>
