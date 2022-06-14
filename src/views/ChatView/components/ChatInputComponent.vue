<template>
  <div class="input__container">
    <form @submit.prevent="onSubmit" enctype="multipart/form-data">
      <div class="plus__icon">
        <label for="file"
          ><font-awesome-icon
            icon="plus-circle"
            class="icon button"
          ></font-awesome-icon
        ></label>
        <input
          type="file"
          name="fileMessage"
          id="file"
          hidden
          ref="fileRef"
          @change="readFile($event)"
          @click="
            (event: any) => {
              if (event && event.target) {
                event.target.value = null;
              }
            }
          "
        />
      </div>
      <div class="input-wrapper">
        <div class="preview-file">
          <Transition>
            <div class="preview" :class="file ? 'active' : ''">
              <img
                src=""
                id="preview-image-img"
                ref="preview-img"
                :class="file?.type.includes('image') ? 'active' : ''"
              />
              <span
                id="preview-filename-span"
                :class="file?.type.includes('application') ? 'active' : ''"
              >
                {{ file?.name }}
              </span>
              <font-awesome-icon
                class="icon"
                icon="circle-xmark"
                @click="removeSelectedFile"
              ></font-awesome-icon>
            </div>
          </Transition>
        </div>
        <input type="text" name="messageContent" v-model="messageContent" />
      </div>
      <div class="other__func">
        <font-awesome-icon
          icon="face-kiss-beam"
          class="icon button"
          @click="showEmojiSelector = !showEmojiSelector"
        ></font-awesome-icon>
        <Transition name="slide-up">
          <div
            ref="emoji-picker"
            class="emoji-picker-wrapper"
            v-if="showEmojiSelector"
          >
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
              @select="selectEmoji"
              @mouseleave="showEmojiSelector = false"
            />
          </div>
        </Transition>
        <!-- <font-awesome-icon icon="user" class="icon"></font-awesome-icon>
      <font-awesome-icon icon="user" class="icon"></font-awesome-icon> -->
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useField, useForm } from "vee-validate";
import useMessageStore from "@/stores/MessageStore";
import { MESSAGE_TYPE, useToastMessageStore } from "@/stores/ToastMessage";
import { refFile } from "@/utilities/Firebase";
import useUserStore from "@/stores/UserStore";
import { EmojiPicker } from "vue3-twemoji-picker-final";

export default defineComponent({
  setup() {
    //Store
    const messageStore = useMessageStore();
    const userStore = useUserStore();

    // State
    let file = ref();
    const fileRef = ref();
    let showEmojiSelector = ref(false);

    // Form
    const { handleSubmit, setFieldValue } = useForm();
    setFieldValue("messageContent", "");
    const { value: messageContent, errorMessage: emailError } =
      useField("messageContent");
    const { value: fileMessage, errorMessage: passwordError } =
      useField("fileMessage");

    // Method
    const onSubmit = handleSubmit(async (values, { resetForm }) => {
      const file = values.fileMessage;
      const firebaseRef = file
        ? refFile(`${userStore.user?.id}/${file.name}`)
        : undefined;
      console.log("[Submit Message]", values, file);
      await messageStore.sendMessage(
        file,
        values.messageContent,
        firebaseRef?.fullPath
      );
      resetForm();
      removeSelectedFile();
    });

    const readFile = async (event: any) => {
      if (event) {
        const selectedFile: File = event.target.files[0];
        console.log(
          selectedFile,
          50 * (1000 * 1000),
          selectedFile.type.includes("image")
        );
        if (selectedFile.size > 50 * (1000 * 1000)) {
          useToastMessageStore().setToast(
            `${MESSAGE_TYPE.ERROR}`,
            "Oversize file",
            "File must smaller than 50MB"
          );
          return;
        }
        if (selectedFile.type.includes("image")) {
          const img: HTMLImageElement = document.getElementById(
            "preview-image-img"
          ) as HTMLImageElement;
          console.log(img);
          const src = URL.createObjectURL(selectedFile);
          img.src = src;
        }
        file.value = selectedFile;
        const reader = new FileReader();
        reader.onloadend = (ev) => {
          console.log(ev, file);
          // console.log(reader.result);
          // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
        };

        reader.readAsDataURL(selectedFile);
        fileMessage.value = selectedFile;
      }
    };

    const removeSelectedFile = () => {
      const inputRef: HTMLInputElement = document.getElementById(
        "file"
      ) as HTMLInputElement;
      inputRef.files = null;
      file.value = null;
      fileRef.value = null;
      console.log("[Remove file] >>>>", file.value);
    };

    const selectEmoji = (e: any) => {
      console.log(e);
      messageContent.value += e.i;
    };
    return {
      file,
      showEmojiSelector,
      messageContent,
      fileMessage,
      readFile,
      removeSelectedFile,
      selectEmoji,
      onSubmit,
    };
  },
  components: {
    EmojiPicker,
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
      overflow: visible;
      display: flex;
      align-items: center;
      position: relative;
    }
    .input-wrapper {
      width: 100%;
      height: 100%;
      overflow: visible;
      display: grid;
      position: relative;
      .preview-file {
        height: 100%;
        // aspect-ratio: 2 / 1;
        width: 15%;
        min-width: 100px;
        position: absolute;
        bottom: 100%;
        transition: all 0.3s ease;
        .preview {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
          transform: translateY(-50px);
          transition: all 0.3s ease;
          &.active {
            opacity: 1;
            transform: translateY(0);
          }
          .icon {
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
          }
          img {
            height: 100%;
            position: absolute;
            aspect-ratio: 1 / 1;
            opacity: 0;
            transform: translateY(-50px);
            top: 0;
            left: 0;
            &.active {
              opacity: 1;
              transform: translateY(0);
            }
          }
          span {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            opacity: 0;
            transform: translateY(-50px);
            &.active {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      }
      input {
        padding: 10px;
        border-radius: 0;
        background-color: var(--vt-c-divider-dark-1);
        width: 100%;
        height: 100%;
        color: var(--vt-c-white);
        word-break: break-word;
      }
    }
    .other__func {
      padding: 10px;
      display: flex;
      align-items: center;
      position: relative;
      overflow: visible;
      .emoji-picker-wrapper {
        position: absolute;
        background-color: var(--vt-c-divider-dark-1);
        border-radius: 10px;
        bottom: 50px;
        right: 100%;
        width: auto;
        height: 500px;
      }
    }
    .icon {
      width: 100%;
      font-size: 2em;
      line-height: 2em;
    }
  }
}
</style>
