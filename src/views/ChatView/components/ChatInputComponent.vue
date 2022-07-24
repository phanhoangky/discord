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
            <!-- <div class="preview" :class="file ? 'active' : ''"> -->
            <img
              src=""
              id="preview-image-img"
              ref="preview-img"
              :class="file?.type.includes('image') ? 'active' : ''"
            />
          </Transition>
          <Transition>
            <span
              id="preview-filename-span"
              v-if="file?.type.includes('application')"
            >
              <!-- :class="file?.type.includes('application') ? 'active' : ''" -->
              <font-awesome-icon icon="file-zipper"></font-awesome-icon>
              {{ file?.name }}
            </span>
          </Transition>
          <Transition>
            <button
              class="button click-ani"
              type="button"
              @click.stop="removeSelectedFile"
              :class="file ? 'active' : ''"
            >
              <font-awesome-icon
                class="icon"
                icon="circle-xmark"
              ></font-awesome-icon>
            </button>
          </Transition>
          <!-- </div> -->
        </div>
        <textarea
          placeholder="Message ........."
          class="message-input"
          type="text"
          name="messageContent"
          v-model="messageContent"
          @keypress.enter="onSubmit"
        ></textarea>
        <div class="send-btn" @submit="onSubmit">
          <button>
            <font-awesome-icon icon="paper-plane"></font-awesome-icon>
          </button>
        </div>
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
    const { value: messageContent } = useField<string>("messageContent");
    const { value: fileMessage } = useField("fileMessage");
    setFieldValue("messageContent", "");

    // Method
    const onSubmit = handleSubmit(async (values, { resetForm }) => {
      const file = values.fileMessage;
      const firebaseRef = file
        ? refFile(`${userStore.user?.id}/${file.name}`)
        : undefined;
      console.log("[Submit Message]", values, file);
      resetForm();
      removeSelectedFile();
      setFieldValue("messageContent", "");
      await messageStore.sendMessage(
        file,
        values.messageContent,
        firebaseRef?.fullPath
      );
    });

    const readFile = async (event: any) => {
      if (event) {
        const selectedFile: File = event.target.files[0];
        console.log(selectedFile, 50 * (1000 * 1000));
        if (selectedFile.size > 50 * (1000 * 1000)) {
          useToastMessageStore().setToast(
            `${MESSAGE_TYPE.ERROR}`,
            "Oversize file",
            "File must smaller than 50MB"
          );
          return;
        }
        const img: HTMLImageElement = document.getElementById(
          "preview-image-img"
        ) as HTMLImageElement;
        console.log(img);
        const src = URL.createObjectURL(selectedFile);
        if (selectedFile.type.includes("image")) {
          img.src = src;
        }
        if (!selectedFile.type.includes("image")) {
          img.src = "";
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
      display: flex;
      flex-direction: row;
      position: relative;
      .send-btn {
        button {
          aspect-ratio: 1 / 1;
          height: 100%;
          background-color: var(--vt-c-black-mute);
          color: var(--vt-c-white-mute);
          border-radius: 0;
          &:hover {
            cursor: pointer;
          }
        }
      }
      .preview-file {
        width: fit-content;
        height: fit-content;
        max-width: 50%;
        position: absolute;
        overflow: visible;
        bottom: calc(100% + 10px);
        transition: all 0.3s ease;
        border-radius: 10px;
        display: flex;
        align-items: center;
        .button {
          width: 30px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          text-align: center;
          padding: 0;
          opacity: 0;
          transform: translateY(-50px);
          &.active {
            opacity: 1;
            transform: translateY(0);
          }
          .icon {
            color: var(--vt-c-button-text);
            width: 100%;
            height: 100%;
          }
        }
        img,
        span {
          height: 100%;
          width: auto;
          background-color: var(--vt-c-modal-bg);
          color: var(--vt-c-modal-text);
          padding: 10px;
          transition: all 0.3s ease;
          border-radius: 10px;
          &.active {
            opacity: 1;
            transform: translateY(0);
          }
        }
        img {
          object-fit: contain;
          max-height: 200px;
          max-width: 50%;
          opacity: 0;
          transform: translateY(-50px);
        }
      }
      input,
      textarea {
        flex: 1;
        padding: 10px;
        width: max-content;
        border-radius: 0;
        background-color: var(--vt-c-divider-dark-1);
        color: var(--vt-c-white);
        word-break: break-word;
      }
      input {
        height: 100%;
      }
      textarea {
        height: fit-content;
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
        z-index: 1099;
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
