<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseModal from "../common/BaseModal.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
export default defineComponent({
  setup() {
    return {};
  },
  data: () => ({
    isShow: false,
  }),

  computed: {},
  methods: {
    closeModal() {
      this.isShow = false;
    },
  },
});
</script>

<style scoped></style>
