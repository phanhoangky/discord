<template>
  <BaseModal
    :modal-name="`Edit Room`"
    :show="roomStore.showEditModal"
    @close="roomStore.setShowEditModal(false)"
    @submit="onSubmit"
  >
    <!-- width="30%" -->
    <section class="edit-room-modal-main">
      <form @submit="onSubmit">
        <div class="field-group">
          <label for="name"><span>Name</span></label>
          <!-- <Field name="name"></Field> -->
          <input type="text" id="name" name="name" v-model="name" />
        </div>
        <span class="error-message">{{ nameError }}</span>
        <!-- <ErrorMessage name="name" class="error-message"></ErrorMessage> -->
      </form>
      <section class="group-users-list" v-if="users.length > 0">
        <header>
          <font-awesome-icon icon="people-group"></font-awesome-icon>
        </header>
        <TransitionGroup tag="ul" class="list-users">
          <li class="user-item" v-for="user in users" :key="user.id">
            <section class="left">
              <div class="user-avatar">
                <img
                  :src="user.photoUrl != '' ? user.photoUrl : defaultAvatarURL"
                />
              </div>
              <div class="user-infor">
                <span class="user-email">{{ user.email }}</span>
                <span class="user-name">
                  {{ user.firstName }} {{ user.lastName }}
                </span>
              </div>
            </section>
            <section class="right">
              <button class="cancel">
                <font-awesome-icon icon="gear"></font-awesome-icon>
              </button>
            </section>
          </li>
        </TransitionGroup>
      </section>
      <font-awesome-icon
        class="group-users-list-empty"
        v-else
        icon="users-slash"
      ></font-awesome-icon>
    </section>
    <template #footer>
      <ConfirmPopup
        title="Do you want to delete this channel"
        :confirm-async="deleteRoom"
        center
        ><button class="cancel-btn cancel">
          <font-awesome-icon icon="trash-can"></font-awesome-icon></button
      ></ConfirmPopup>
      <button
        class="cancel-btn cancel"
        @click="roomStore.setShowEditModal(false)"
      >
        Cancel
      </button>
      <button class="submit-btn primary" @click="onSubmit">Edit</button>
    </template>
  </BaseModal>
  <button
    class="click-ani"
    v-if="selectedRoom"
    @click="roomStore.setShowEditModal(true)"
  >
    <font-awesome-icon icon="gear"></font-awesome-icon>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import BaseModal from "@/components/common/BaseModal.vue";
import { useForm, useField } from "vee-validate";
import { mapActions, mapState } from "pinia";
import { useRoomStore } from "@/stores/RoomStore";
import * as yup from "yup";
import ConfirmPopup from "../../common/ConfirmPopup.vue";
import useUserStore from "@/stores/UserStore";
import type { User } from "@/stores/models/User";
export default defineComponent({
  setup() {
    //Store
    const roomStore = useRoomStore();

    //State
    const schema = yup.object({
      name: yup.string().required().max(50).min(5),
    });
    const showKickUserModal = ref(false);
    let selectedUser = ref<User>();
    //
    const { setValues, handleSubmit } = useForm({
      validationSchema: schema,
    });

    const { value: name, errorMessage: nameError } = useField("name");
    // Computed
    const defaultAvatarURL = computed(() => {
      const imgUrl = new URL(
        "../../../assets/defaultuser.png",
        import.meta.url
      );
      return imgUrl.toString();
    });
    // Method
    const onSubmit = handleSubmit(async (values) => {
      roomStore
        .editRoom({ id: roomStore.selectedRoom?.id, ...values })
        .then(() => {
          roomStore.setShowEditModal(false);
        });
    });

    const deleteRoom = async () => {
      console.log("Delete");

      if (roomStore.selectedRoom) {
        await roomStore.deleteRoom(roomStore.selectedRoom.id);
        roomStore.setShowEditModal(false);
      }
    };

    //Subscribe
    roomStore.$subscribe((mutation, state) => {
      if (state.showEditModal == true) {
        setValues({
          name: roomStore.selectedRoom?.name,
        });
      }
    });

    return {
      roomStore,
      selectedUser,
      onSubmit,
      deleteRoom,
      defaultAvatarURL,
      name,
      nameError,
      showKickUserModal,
    };
  },
  components: {
    BaseModal,
    // Field,
    // ErrorMessage,
    ConfirmPopup,
  },
  computed: {
    ...mapState(useRoomStore, {
      isShow: "showEditModal",
      selectedRoom: "selectedRoom",
    }),
    ...mapState(useUserStore, {
      users: "users",
    }),
  },
  methods: {
    ...mapActions(useRoomStore, {
      setIsShow: "setShowEditModal",
      kickUserFromRoom: "kickUserFromRoom",
    }),
    ...mapActions(useUserStore, {
      fetchUsersInRoom: "fetchUsersInRoom",
    }),
    async kickUser(user: User) {
      //
      if (this.selectedRoom) {
        await this.kickUserFromRoom(user, this.selectedRoom?.id);
        await this.fetchUsersInRoom({
          isLoading: true,
          isNotify: false,
        });
      }
    },
  },
});
</script>

<style scoped lang="scss">
.edit-room-modal-main {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;

  form {
    .field-group {
      input[type="text"] {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
    }
  }

  .group-users-list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1em;
    flex-direction: column;
    header {
      font-size: 2em;
      color: var(--color-text);
    }
    .list-users {
      .user-item {
        display: flex;
        justify-content: space-between;
        background-color: var(--vt-c-list-item-bg);
        color: var(--vt-c-list-item-text);
        padding: 5px;
        border-radius: 5px;
        transition: all 0.3s ease;
        &:hover {
          background-color: var(--vt-c-list-item-bg-hover);
          color: var(--vt-c-list-item-text-hover);
        }
        .left {
          flex: 1;
          flex-shrink: 0;
          display: flex;
          height: 100%;
          align-items: center;
          .user-avatar {
            flex: 1;
            border-radius: 50%;
            background-color: var(--color-background-mute);
            img {
              height: 100%;
              aspect-ratio: 1 / 1;
              border-radius: 50%;
            }
          }
          .user-infor {
            flex: 4;
            display: flex;
            flex-direction: column;
            padding-left: 1em;
            .user-email {
              width: 100%;
            }
            .user-name {
              width: 100%;
              text-indent: 1em;
            }
          }
        }
        .right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          button {
          }
        }
      }
    }
  }
  .group-users-list-empty {
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    margin-top: 1em;
    font-size: 2em;
    color: var(--color-text);
  }
}
</style>
