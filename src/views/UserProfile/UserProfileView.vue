<template>
  <div class="user-profile-wrapper">
    <article class="profile-view">
      <header></header>
      <main>
        <section class="user-avatar">
          <label class="avatar" for="avatar">
            <div class="avatar-overlay">
              <img id="image-preview" src="@/assets/logo.svg" />
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
            <div class="user-infor-item">
              <label>
                <font-awesome-icon icon="user"></font-awesome-icon>
              </label>
              <Field
                name="fullname"
                disabled
                :value="`${user?.firstName} ${user?.lastName}`"
              />
            </div>
            <ErrorMessage name="fullname"></ErrorMessage>
            <div class="user-infor-item">
              <label>
                <font-awesome-icon icon="envelope"></font-awesome-icon>
              </label>
              <input disabled :value="user?.email" />
            </div>
            <div class="user-infor-item">
              <label>
                <font-awesome-icon icon="mobile"></font-awesome-icon>
              </label>
              <Field name="phoneNumber" :value="user?.phoneNumber" />
            </div>
            <ErrorMessage name="phoneNumber"></ErrorMessage>
          </Form>
        </section>
      </main>
      <footer class="footer">
        <button @click="cancelChange">
          <font-awesome-icon icon="circle-xmark"></font-awesome-icon>
        </button>
        <button :disabled="!isChanged">
          <font-awesome-icon icon="floppy-disk"></font-awesome-icon>
        </button>
      </footer>
    </article>
  </div>
</template>

<script lang="ts">
import useUserStore from "@/stores/UserStore";
import { mapActions, mapState } from "pinia";
import { computed, defineComponent } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const oldData = userStore.user;

    const isChanged = computed(() => {
      console.log(JSON.stringify(oldData) == JSON.stringify(userStore.user));

      return JSON.stringify(oldData) != JSON.stringify(userStore.user);
    });
    const cancelChange = () => {
      userStore.setUser(oldData);
    };
    const schema = yup.object({
      fullname: yup.string().required().max(50),
      phoneNumber: yup.string().required().min(9),
    });
    return {
      oldData,
      isChanged,
      cancelChange,
      schema,
    };
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  computed: {
    ...mapState(useUserStore, {
      user: "user",
    }),
  },
  methods: {
    ...mapActions(useUserStore, {
      setUser: "setUser",
      updateUser: "updateUserProfile",
    }),
    async previewImage(event: any) {
      console.log("[Get File >>>]", event.target.files);
      const src = URL.createObjectURL(event.target.files[0]);
      const imgElement = document.getElementById("image-preview");

      if (imgElement) {
        imgElement.src = src;
        await this.updateUser({
          photoUrl: src,
        });
        this.setUser({ photoUrl: src });
      }
    },
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
  .profile-view {
    display: grid;
    width: 100%;
    height: auto;
    border-radius: 10px;
    overflow: hidden;
    grid-template-rows: 1fr 3fr 50px;
    header {
      background-color: var(--vt-c-header-bg-color);
    }
    main {
      background-color: rgb(222, 222, 222);
      display: grid;
      padding: 10px;
      grid-template-rows: 1fr 3fr;
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
