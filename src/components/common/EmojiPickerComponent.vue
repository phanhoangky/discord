<template>
  <EmojiPicker
    ref="emojiPicker"
    id="emoji-picker"
    :options="{
      imgSrc: '/src/assets/img/',
      locals: 'en',
      hasGroupNames: false,
      stickyGroupNames: false,
      recentRecords: false,
    }"
    @select="$emit('selectEmoji')"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EmojiPicker } from "vue3-twemoji-picker-final";
export default defineComponent({
  setup() {
    return {};
  },
  emits: ["selectEmoji", "closePicker"],
  components: {
    EmojiPicker,
  },
  methods: {
    close() {
      this.$emit("closePicker");
    },
  },
  // mounted() {
  //   const ep: HTMLElement = document.getElementById(
  //     "emoji-picker"
  //   ) as HTMLElement;
  //   ep.addEventListener("mouseout", close);
  // },
  // unmounted() {
  //   const ep: HTMLElement = document.getElementById(
  //     "emoji-picker"
  //   ) as HTMLElement;
  //   ep.removeEventListener("mouseleave", close);
  // },
});
</script>

<style scoped></style>
