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
                v-if="newUser.photoUrl != ''"
                :src="newUser.photoUrl"
              />
              <font-awesome-icon
                v-if="!newUser.photoUrl || newUser.photoUrl == ''"
                icon="user"
              ></font-awesome-icon>
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
                <label>
                  <font-awesome-icon icon="l"></font-awesome-icon>
                </label>
                <Field name="lastname" disabled v-model="user!.lastName" />
                <ErrorMessage
                  name="lastname"
                  class="error-message"
                ></ErrorMessage>
              </div>
              <div class="field-group">
                <label>
                  <font-awesome-icon icon="f"></font-awesome-icon>
                </label>
                <Field name="firstname" disabled v-model="user!.firstName" />
                <ErrorMessage
                  name="firstname"
                  class="error-message"
                ></ErrorMessage>
              </div>
            </div>
            <div class="user-infor-item">
              <label>
                <font-awesome-icon icon="envelope"></font-awesome-icon>
              </label>
              <Field name="email" disabled :value="user?.email" />
            </div>
            <div class="user-infor-item">
              <label>
                <font-awesome-icon icon="mobile"></font-awesome-icon>
              </label>
              <Field name="phoneNumber" v-model="newUser.phoneNumber" />
            </div>
            <ErrorMessage
              name="phoneNumber"
              class="error-message"
            ></ErrorMessage>
            <div class="user-infor-item">
              <label>
                <font-awesome-icon icon="cake-candles"></font-awesome-icon>
              </label>
              <Field type="date" name="dob" v-model="newUser.dateOfBirth" />
            </div>
            <ErrorMessage name="dob" class="error-message"></ErrorMessage>
            <div class="user-infor-item">
              <label>
                <font-awesome-icon icon="venus-mars"></font-awesome-icon>
              </label>
              <div class="radio-group">
                <Field
                  label="Male"
                  type="radio"
                  name="gender"
                  :value="`Male`"
                  v-model="newUser.gender"
                />
                Male
                <Field
                  label="Female"
                  type="radio"
                  name="gender"
                  :value="`Female`"
                  v-model="newUser.gender"
                />
                Female
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
  </div>
</template>

<script lang="ts">
import useUserStore from "@/stores/UserStore";
import { mapActions, mapState, storeToRefs } from "pinia";
import { computed, defineComponent, ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import type { UpdateUserProfileRequest } from "@/stores/models/User";
import { onBeforeRouteLeave } from "vue-router";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    // const oldData = userStore.user;
    const user = { ...userStore.user };
    const newUser = ref({ ...user });
    const isChanged = computed(() => {
      console.log("[Compare]>>>", newUser.value, userStore.user);

      console.log(
        JSON.stringify(newUser?.value) == JSON.stringify(userStore.user)
      );

      return JSON.stringify(newUser?.value) != JSON.stringify(userStore.user);
    });
    const cancelChange = () => {
      // newData = storeToRefs(userStore);
      newUser.value = { ...user };
      const imgElement = document.getElementById(
        "image-preview"
      ) as HTMLImageElement;

      if (imgElement) {
        imgElement.src = "";
      }
    };
    const schema = yup.object({
      fullname: yup.string().required().max(50),
      phoneNumber: yup.string().required().min(9),
    });

    //Method
    const previewImage = async (event: any) => {
      const file = event.target.files[0];
      console.log("[Get File >>>]", event.target.files);
      const src = URL.createObjectURL(file);
      const imgElement = document.getElementById(
        "image-preview"
      ) as HTMLImageElement;

      if (imgElement) {
        imgElement.src = src;
        newUser.value.file = file;
        // await this.updateUser({
        //   photoUrl: src,
        // });
        // this.setUser({ photoUrl: src });
        console.log("[New User] >>>>", newUser.value);
      }
    };
    const updateProfile = async () => {
      //
      if (userStore.user) {
        const request: UpdateUserProfileRequest = {
          id: userStore.user.id,
          ...newUser.value,
        };
        const data = await userStore.updateUserProfile(request);
      }
    };
    onBeforeRouteLeave((to, from, next) => {
      //
    });
    // Subcribe
    userStore.$onAction(({ after, name }) => {
      if (name == "updateUserProfile") {
        after((res) => {
          newUser.value = { ...res };
        });
      }
    });
    return {
      newUser,
      user,
      isChanged,
      schema,
      cancelChange,
      previewImage,
      updateProfile,
    };
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  computed: {},
  methods: {
    ...mapActions(useUserStore, {
      setUser: "setUser",
      updateUser: "updateUserProfile",
    }),
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
    header {
      background-color: var(--vt-c-header-bg-color);
    }
    main {
      background-color: rgb(222, 222, 222);
      display: grid;
      padding: 10px;
      grid-template-rows: 100px 1fr;
      gap: 10px;
      .user-avatar {
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateY(-25%);
        .avatar {
          height: 125%;
          aspect-ratio: 1 / 1;
          position: relative;
          cursor: alias;
          .avatar-overlay {
            height: 100%;
            position: absolute;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            background-color: antiquewhite;
            img {
              width: 100%;
              aspect-ratio: 1 / 1;
              // position: absolute;
              // top: 0;
              // right: 0;
              // left: 0;
              padding: 5px;
              border-radius: 50%;
              border: 5px solid var(--vt-c-blue-light-2);
            }
          }
        }
        .username {
          font-weight: bolder;
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
            label {
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
            .radio-group {
              width: 100%;
              display: flex;
              align-items: flex-start;
              justify-content: space-evenly;
              input {
                height: auto;
              }
            }
            input {
              width: 100%;
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
      button {
      }
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
