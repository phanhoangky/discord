<template>
  <BaseModal
    :show="isShow"
    :modal-name="`Invite users`"
    @close="isShow = false"
    @submit="
      async () => {
        await sendInvitation();
        isShow = false;
      }
    "
  >
    <div class="modal-content">
      <form @submit.prevent="onSearchSubmit">
        <Field name="username"></Field>
      </form>
      <TransitionGroup name="list" tag="ul">
        <li
          v-for="user in listUsers"
          :key="user.id"
          @click="selectUser(user)"
          :class="user.isSelected ? `selected` : ``"
        >
          <img src="@/assets/logo.svg" />
          <span>{{ user.email }}</span>
          <Transition>
            <font-awesome-icon
              icon="circle-check"
              class="icon circle-check"
              v-if="user.isSelected"
            ></font-awesome-icon>
          </Transition>
        </li>
      </TransitionGroup>
      <span v-if="listUsers && listUsers.length == 0">Empty</span>
    </div>
    <!-- Invite User -->
  </BaseModal>
  <button class="click-ani" @click="isShow = true">
    <slot> <font-awesome-icon icon="user-plus"></font-awesome-icon> </slot>
  </button>
</template>

<script lang="ts">
import type { User } from "@/stores/models/User";
import useUserStore from "@/stores/UserStore";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import BaseModal from "../../common/BaseModal.vue";
import { useForm, Field } from "vee-validate";
import useInvitationStore from "@/stores/InvitationStore";
import useMessageStore from "@/stores/MessageStore";

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const invitationStore = useInvitationStore();
    const messageStore = useMessageStore();
    const isShow = ref(false);

    const listUsers = computed(() => {
      if (userStore.usersInRoom && userStore.usersInRoom.length > 0) {
        return userStore.users.filter(
          (user) => !userStore.usersInRoom.some((e) => e.id == user.id)
        );
      }
      return userStore.users;
    });
    const { handleSubmit } = useForm();
    const selectUser = (user: User) => {
      console.log("[User Selected] >>>>", user);
      user.isSelected = !user.isSelected;
    };

    const onSearchSubmit = handleSubmit(async (values) => {
      console.log("[Searchname] >>>", values);
      await userStore.fetchUsers(values);
    });

    const sendInvitation = async () => {
      const listInvite = listUsers.value.filter((u) => u.isSelected);
      if (messageStore.selectedRoom) {
        await invitationStore.sendInvitations({
          content: `${userStore.user?.firstName} ${userStore.user?.lastName} want to invite you to ${messageStore.selectedRoom.name} room ?`,
          receiverIds: listInvite.map((item) => item.id),
          roomId: messageStore.selectedRoom.id,
        });
      }
    };
    onMounted(() => {
      watch(
        () => isShow.value,
        async (nValue, oValue) => {
          // console.log("[Invite Modal] >>>>", nValue, oValue);
          if (nValue == true) {
            // await userStore.fetchUsers();
          }
        }
      );
    });

    return {
      isShow,
      userStore,
      selectUser,
      onSearchSubmit,
      sendInvitation,
      listUsers,
    };
  },
  components: { BaseModal, Field },
});
</script>

<style scoped lang="scss">
.modal-content {
  width: 100%;
  height: 100%;
  form {
    input {
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
  }
  ul {
    width: 100%;
    max-height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 5px;
    li {
      display: grid;
      gap: 5px;
      // border: 1px solid black;
      // padding: 5px;
      align-items: center;
      // box-shadow: 0px 0px 1px 1px var(--vt-c-blue-light-2);
      height: 50px;
      border-radius: 10px;
      overflow: hidden;
      grid-template-columns: 50px 1fr 50px;
      transition: all 0.3s ease;
      &.selected {
        background-color: rgb(110, 110, 110);
        box-shadow: 0px 0px 5px 5px var(--vt-c-blue-light-2);
        color: var(--vt-c-white-mute);
      }
      &:hover {
        background-color: var(--vt-c-list-item-bg-hover);
      }
      img {
        height: 100%;
        aspect-ratio: 1 / 1;
      }
      span {
      }
      .icon {
        font-size: large;
        border-radius: 50%;
        box-shadow: 0px 0px 5px 5px var(--vt-c-blue-light-2);
      }
    }
  }
}

.list-enter-active,
.list-leave-active,
.list-move {
  transition: all 0.3s ease;
}
.list-leave-active {
  position: absolute;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
</style>
