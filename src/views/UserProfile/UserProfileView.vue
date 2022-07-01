<template>
  <div class="user-profile-wrapper">
    <article class="profile-view">
      <header></header>
      <main>
        <section class="user-avatar">
          <label class="avatar" for="avatar">
            <div class="avatar-overlay">
              <img
                id="image-preview"
                :src="
                  newUser.photoUrl != '' ? newUser.photoUrl : defaultAvatarURL
                "
              />
            </div>
          </label>
          <input
            hidden
            id="avatar"
            type="file"
            accept="image/*"
            @change="previewImage($event)"
          />
          <span class="username"
            >{{ user?.firstName }} {{ user?.lastName }}</span
          >
        </section>
        <section class="user-infor">
          <Form :validation-schema="schema">
            <div class="user-infor-item flex-horizontal">
              <div class="field-group">
                <label class="field-label">
                  <font-awesome-icon icon="l"></font-awesome-icon>
                </label>
                <Field
                  name="lastname"
                  type="text"
                  disabled
                  v-model="user!.lastName"
                />
                <ErrorMessage
                  name="lastname"
                  class="error-message"
                ></ErrorMessage>
              </div>
              <div class="field-group">
                <label class="field-label">
                  <font-awesome-icon icon="f"></font-awesome-icon>
                </label>
                <Field
                  name="firstname"
                  type="text"
                  disabled
                  v-model="user!.firstName"
                />
                <ErrorMessage
                  name="firstname"
                  class="error-message"
                ></ErrorMessage>
              </div>
            </div>
            <div class="user-infor-item">
              <label class="field-label">
                <font-awesome-icon icon="envelope"></font-awesome-icon>
              </label>
              <Field type="text" name="email" disabled :value="user?.email" />
            </div>
            <div class="user-infor-item">
              <label class="field-label">
                <font-awesome-icon icon="mobile"></font-awesome-icon>
              </label>
              <Field
                type="text"
                name="phoneNumber"
                v-model="newUser.phoneNumber"
              />
            </div>
            <ErrorMessage
              name="phoneNumber"
              class="error-message"
            ></ErrorMessage>
            <div class="user-infor-item">
              <label class="field-label">
                <font-awesome-icon icon="cake-candles"></font-awesome-icon>
              </label>
              <Field
                type="date"
                name="dateOfBirth"
                v-model="newUser.dateOfBirth"
              />
            </div>
            <ErrorMessage
              name="dateOfBirth"
              class="error-message"
            ></ErrorMessage>
            <div class="user-infor-item">
              <label class="field-label">
                <font-awesome-icon icon="venus-mars"></font-awesome-icon>
              </label>
              <div class="radio-group">
                <div class="radio-group-item">
                  <Field
                    label="Male"
                    id="male"
                    type="radio"
                    class="custom-radio"
                    name="gender"
                    :value="`Male`"
                    v-model="newUser.gender"
                  />
                  <label for="male"> Male </label>
                </div>
                <div class="radio-group-item">
                  <Field
                    label="Female"
                    id="female"
                    class="custom-radio"
                    type="radio"
                    name="gender"
                    :value="`Female`"
                    v-model="newUser.gender"
                  />
                  <label for="female"> Female </label>
                </div>
              </div>
            </div>
            <ErrorMessage name="gender" class="error-message"></ErrorMessage>
          </Form>
        </section>
      </main>
      <footer class="footer">
        <button @click="cancelChange">
          <font-awesome-icon icon="circle-xmark"></font-awesome-icon>
        </button>
        <button :disabled="!isChanged" @click="updateProfile">
          <font-awesome-icon icon="floppy-disk"></font-awesome-icon>
        </button>
      </footer>
    </article>

    <!-- Change route discard modal -->
    <BaseModal
      :show="showDiscardChangeModal"
      :modal-name="`Discard change ?`"
      @close="
        () => {
          isChanged = true;
          showDiscardChangeModal = false;
          $router.push(routeTo);
        }
      "
      @submit="
        () => {
          showDiscardChangeModal = false;
        }
      "
    >
      <span>You have made some change, do you want to discard them ?</span>
      <template #cancel-button>Discard</template>
      <template #submit-button>Cancel</template>
    </BaseModal>
  </div>
</template>

<script lang="ts">
import useUserStore from "@/stores/UserStore";
import { computed, defineComponent, ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import type { UpdateUserProfileRequest } from "@/stores/models/User";
import { onBeforeRouteLeave } from "vue-router";
import BaseModal from "../../components/common/BaseModal.vue";

export default defineComponent({
  setup() {
    //Store
    const userStore = useUserStore();
    //State
    const user = { ...userStore.user };
    const newUser = ref({ ...user });
    const showDiscardChangeModal = ref(false);
    const schema = yup.object({
      fullname: yup.string().required().max(50),
      phoneNumber: yup.string().required().min(9),
    });
    const routeTo = ref("");
    //Computed
    const isChanged = computed({
      // getter
      get() {
        console.log("[Compare]>>>", newUser.value, userStore.user);
        return JSON.stringify(newUser?.value) != JSON.stringify(userStore.user);
      },
      // setter
      set() {
        cancelChange();
      },
    });
    const defaultAvatarURL = computed(() => {
      const imgUrl = new URL("../../assets/defaultuser.png", import.meta.url);
      return imgUrl.toString();
    });
    //Method
    const cancelChange = () => {
      newUser.value = { ...user };
      // const imgElement = document.getElementById(
      //   "image-preview"
      // ) as HTMLImageElement;

      // if (imgElement) {
      //   const newUser = ref({ ...user });
      // }
    };
    const previewImage = async (event: any) => {
      const file = event.target.files[0];
      const src = URL.createObjectURL(file);
      const imgElement = document.getElementById(
        "image-preview"
      ) as HTMLImageElement;

      console.log("[Get File >>>]", event.target.files, imgElement);
      if (imgElement) {
        imgElement.src = src;
        newUser.value.file = file;
        newUser.value.photoUrl = src;
      }
    };
    const updateProfile = async () => {
      //
      if (userStore.user) {
        const request: UpdateUserProfileRequest = {
          id: userStore.user.id,
          ...newUser.value,
        };
        await userStore.updateUserProfile(request);
      }
    };

    // Subcribe
    userStore.$onAction(({ after, name }) => {
      if (name == "updateUserProfile") {
        after((res) => {
          newUser.value = { ...res };
        });
      }
    });
    onBeforeRouteLeave((to, from, next) => {
      if (isChanged.value) {
        showDiscardChangeModal.value = true;
        from.meta.isReady = false;
        routeTo.value = to.path;
        return;
      }
      //
      if (!isChanged.value) {
        from.meta.isReady = true;
        next();
      }
    });
    return {
      newUser,
      user,
      isChanged,
      schema,
      defaultAvatarURL,
      showDiscardChangeModal,
      routeTo,
      cancelChange,
      previewImage,
      updateProfile,
    };
  },
  components: {
    Form,
    Field,
    ErrorMessage,
    BaseModal,
  },
  computed: {},
  methods: {},
  created() {
    console.log(useUserStore().user);
  },
});
</script>

<style scoped lang="scss">
.user-profile-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  font-weight: bolder;
  overflow-y: scroll;
  .profile-view {
    display: grid;
    flex-direction: column;
    width: 100%;
    height: auto;
    border-radius: 10px;
    overflow: hidden;
    grid-template-rows: 1fr 4fr 50px;
    box-shadow: 5px 5px 20px 2px var(--vt-c-primary-shadow-box);
    header {
      background-color: var(--vt-c-header-bg-color);
    }
    main {
      background-color: var(--color-background-soft);
      display: grid;
      padding: 10px;
      grid-template-rows: 100px 1fr;
      gap: 10px;
      .user-avatar {
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateY(-30%);
        .avatar {
          height: 100%;
          aspect-ratio: 1 / 1;
          position: relative;
          cursor: alias;
          .avatar-overlay {
            height: 100%;
            position: absolute;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            background-color: antiquewhite;
            overflow: hidden;
            .image-preview {
              height: 100%;
              aspect-ratio: 1 / 1;
              border-radius: 50%;
              text-align: center;
            }
            img {
              width: 100%;
              aspect-ratio: 1 / 1;
              padding: 5px;
              border-radius: 50%;
              border: 5px solid var(--vt-c-blue-light-2);
            }
          }
        }
        .username {
          font-weight: bolder;
          color: var(--color-text);
          text-shadow: var(--vt-c-header-text-shadow);
        }
      }
      .user-infor {
        display: flex;
        background-color: var(--vt-c-divider-dark-2);
        border-radius: 10px;
        form {
          display: flex;
          flex-direction: column;
          padding: 10px;
          gap: 10px;
          .user-infor-item {
            display: flex;
            input[type="text"],
            input[type="date"] {
              width: 100%;
            }
            label.field-label {
              width: 50px;
              aspect-ratio: 1 / 1;
              display: flex;
              justify-content: center;
              align-items: center;
              color: aliceblue;
              background-color: var(--vt-c-black-soft);
              border-top-left-radius: 10px;
              border-bottom-left-radius: 10px;
            }
            select {
              width: 100%;
            }
            &.flex-horizontal {
              flex-direction: row;
              gap: 10px;
            }
            &.flex-verticle {
              flex-direction: column;
            }
            .field-group {
              width: 100%;
            }

            .radio-group {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              .radio-group-item {
                display: flex;
                align-items: center;
                color: var(--color-text);
                .custom-radio {
                  width: 40px;
                  height: 40px;
                }
              }
            }
          }
        }
      }
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 10px;
      gap: 10px;
      background-color: var(--vt-c-header-bg-color);
      color: var(--vt-c-header-text-color);
    }
  }
}

@media only screen and (min-width: 50em) {
  .user-profile-wrapper {
    .profile-view {
      width: 60%;
    }
  }
}
</style>
