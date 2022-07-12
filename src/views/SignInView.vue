<template>
  <div class="sign-in-component-wrapper">
    <header class="header custom-text-shadow">
      <div class="image-overlay">
        <img src="@/assets/dlf.pt-discord-png-47757.png" />
      </div>
    </header>
    <Form class="form" @submit="login" :validation-schema="schema">
      <div class="form__field">
        <label for="email">
          <font-awesome-icon icon="user" />
          <!-- <span class="hidden">Username</span> -->
        </label>
        <Field type="text" name="email" id="email" placeholder="Email"></Field>
      </div>
      <ErrorMessage name="email" class="error-message"></ErrorMessage>
      <div class="form__field">
        <label for="password"
          ><font-awesome-icon icon="lock" />
          <!-- <span class="hidden">Username</span> -->
        </label>
        <Field
          type="password"
          name="password"
          id="password"
          placeholder="Password"
        ></Field>
      </div>
      <ErrorMessage name="password" class="error-message"></ErrorMessage>
      <button class="primary">Login</button>
      <button
        type="button"
        class="create-btn"
        @click="
          () => {
            $router.push('/sign-up');
          }
        "
      >
        Create New Account
      </button>
    </Form>
    <hr />
    <router-link class="custom-text-shadow" to="/forgot-password">
      Forget your password ?
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { object, string } from "yup";
import { mapActions } from "pinia";
import useUserStore from "@/stores/UserStore";
export default defineComponent({
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const schema = object({
      email: string().required().email(),
      password: string().required().min(8),
    });
    return { schema };
  },
  computed: {},
  methods: {
    ...mapActions(useUserStore, {
      signIn: "SignIn",
    }),
    async login(values: any) {
      await this.signIn(values.email, values.password);
      console.log(values);
    },
  },
});
</script>

<style scoped lang="scss">
.sign-in-component-wrapper {
  // min-width: 300px;
  background-color: var(--vt-c-divider-dark-1);
  border-radius: 1em;
  box-shadow: 5px 5px 20px 1px;
  width: 100%;
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  a {
    text-decoration: none;
    text-align: center;
    color: var(--vt-c-white);
    font-size: 1.2em;
  }
  .header {
    display: flex;
    padding: 1em;
    .image-overlay {
      height: 100%;
      display: flex;
      justify-content: center;
      img {
        width: 50%;
      }
    }
  }
  .form {
    width: 100%;
    &__field {
      margin-bottom: 0.5em;
      display: flex;
      align-items: center;
      label {
        padding-inline: 1em;
        padding: 1em;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        border-top-left-radius: 1em;
        border-bottom-left-radius: 1em;
        background-color: var(--vt-c-black-soft);
        color: var(--vt-c-white-soft);
      }
      input {
        width: 100%;
        outline: 0;
        border: 0;
        padding: 1.25em;
        border-top-right-radius: 1em;
        border-bottom-right-radius: 1em;
      }
    }

    button {
      width: 100%;
      outline: 0;
      border: 0;
      font-weight: bolder;
      font-size: 1.2em;
      &.create-btn {
        margin: 1em 0;
        background-color: var(--vt-c-blue-light-2);
        color: var(--vt-c-white-soft);
      }
    }
  }
}

@media only screen and (min-width: 50em) {
  .sign-in-component-wrapper {
    width: 60%;
  }
}
</style>
