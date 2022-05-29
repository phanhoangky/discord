<template>
  <div class="input__container">
    <form @submit.prevent="enter">
      <div class="plus__icon">
        <font-awesome-icon
          icon="plus-circle"
          class="icon button"
        ></font-awesome-icon>
      </div>
      <Field name="messageContent" class="input" @keypress="enter" />
      <div class="other__func">
        <font-awesome-icon
          icon="face-kiss-beam"
          class="icon button"
        ></font-awesome-icon>
        <!-- <font-awesome-icon icon="user" class="icon"></font-awesome-icon>
      <font-awesome-icon icon="user" class="icon"></font-awesome-icon> -->
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Field, useForm } from "vee-validate";
import useMessageStore from "@/stores/MessageStore";
export default defineComponent({
  setup() {
    const messageStore = useMessageStore();
    const onSubmit = useForm().handleSubmit((values, { resetForm }) => {
      messageStore.sendMessage(values.messageContent);
      resetForm();
    });
    const enter = (event: Event) => {
      console.log(event.type);

      if (event.type == "submit") {
        console.log(event.type, event.currentTarget);
        onSubmit();
      }
    };
    return {
      enter,
    };
  },
  components: {
    Field,
  },
  methods: {},
});
</script>

<style scoped lang="scss">
.input__container {
  display: flex;
  width: 100%;
  background-color: var(--vt-c-black-mute);
  border-radius: 10px;
  form {
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: var(--vt-c-black-mute);
    border-radius: 10px;
    .plus__icon {
      padding: 10px;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
    }
    .input {
      padding: 10px;
      border-radius: 0;
      background-color: var(--vt-c-divider-dark-1);
      width: 100%;
      color: var(--vt-c-white);
    }
    .other__func {
      padding: 10px;
      display: flex;
      align-items: center;
    }
    .icon {
      width: 100%;
      font-size: 2em;
      line-height: 2em;
    }
  }
}
</style>
