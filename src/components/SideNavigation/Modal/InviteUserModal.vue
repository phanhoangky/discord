<template>
  <BaseModal :modal-name="`Invite`" @close="isShow = false" :show="isShow">
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseModal from "../../common/BaseModal.vue";

export default defineComponent({
  setup() {
    return {};
  },
  data: () => ({
    isShow: false,
  }),
  components: { BaseModal },
});
</script>

<style scoped lang="scss"></style>
