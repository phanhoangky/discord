<template>
  <BaseModal
    :show="invitationStore.showInviteUsersModal"
    :modal-name="`Invite users`"
    @close="
      invitationStore.$patch({
        showInviteUsersModal: false,
      })
    "
    @submit="
      async () => {
        await sendInvitation();
        invitationStore.$patch({
          showInviteUsersModal: false,
        });
      }
    "
  >
    <div class="modal-content">
      <form @submit.prevent="onSearchSubmit">
        <div class="field-group">
          <label for="username" class="field-label">
            <font-awesome-icon icon="magnifying-glass"></font-awesome-icon>
          </label>
          <Field
            id="username"
            type="text"
            name="username"
            class="field-input"
            placeholder="Search username ....."
          ></Field>
        </div>
      </form>
      <TransitionGroup
        name="list"
        tag="ul"
        id="list-users"
        :class="{ hidden: listUsers.length == 0 }"
        @scroll="infiniteScroll"
      >
        <li
          v-for="user in listUsers"
          :key="user.id"
          @click="selectUser(user)"
          :class="user.isSelected ? `selected` : ``"
        >
          <section class="user-infor">
            <div class="image-overlay">
              <img
                :src="user.photoUrl != '' ? user.photoUrl : defaultAvatarURL"
              />
            </div>
            <span>{{ user.firstName }} {{ user.lastName }}</span>
            <span v-if="user.isInvited">| Waiting for response</span>
          </section>
          <Transition>
            <font-awesome-icon
              icon="circle-check"
              class="icon circle-check"
              v-if="user.isSelected"
            ></font-awesome-icon>
          </Transition>
        </li>
      </TransitionGroup>
      <div class="empty-list" v-if="listUsers && listUsers.length == 0">
        <font-awesome-icon
          class="empty-icon"
          icon="users-slash"
        ></font-awesome-icon>
      </div>
    </div>
    <!-- Invite User -->
  </BaseModal>
  <button class="click-ani" @click="openInviteUsersModal">
    <slot>
      <font-awesome-icon icon="user-plus"></font-awesome-icon>
    </slot>
  </button>
</template>

<script lang="ts">
import type { GetUserRequest, User } from "@/stores/models/User";
import useUserStore from "@/stores/UserStore";
import { computed, defineComponent, ref, watch } from "vue";
import BaseModal from "../../common/BaseModal.vue";
import { useForm, Field } from "vee-validate";
import useInvitationStore from "@/stores/InvitationStore";
import useMessageStore from "@/stores/MessageStore";
import { storeToRefs } from "pinia";
import { callGetUsersForInvitation } from "@/stores/services/UserStoreServices";

export default defineComponent({
  setup() {
    // Store
    const userStore = useUserStore();
    const invitationStore = useInvitationStore();
    const messageStore = useMessageStore();
    //State
    const listUsers = ref([] as User[]);
    const { showInviteUsersModal } = storeToRefs(invitationStore);
    let request = ref({
      currentItemsCount: listUsers.value.length,
      currentPage: 0,
      isInfiniteScroll: true,
      isLoading: true,
      isPaging: true,
      itemsPerPage: 10,
      searchName: "",
    } as GetUserRequest);
    let totalUsers = ref(0);
    //Conmputed
    // const listUsers = computed(() => {
    //   return userStore.users;
    // });
    const defaultAvatarURL = computed(() => {
      const imgUrl = new URL(
        "../../../assets/defaultuser.png",
        import.meta.url
      );
      return imgUrl.toString();
    });

    // Method
    const { handleSubmit } = useForm();
    const selectUser = (user: User) => {
      console.log("[User Selected] >>>>", user);
      if (!user.isInvited) {
        user.isSelected = !user.isSelected;
      }
    };

    const onSearchSubmit = handleSubmit(async (values) => {
      console.log("[Searchname] >>>", values);
      // await userStore.fetchUsers(values);
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
    const openInviteUsersModal = async () => {
      invitationStore.$patch({
        showInviteUsersModal: true,
      });
      const data = await callGetUsersForInvitation(request);
      totalUsers.value = data.totalCount;
      const inRoomUsers = userStore.users;
      const exceptUsers = data.results.filter((r: User) =>
        inRoomUsers.every((u) => u.id != r.id)
      );
      listUsers.value = [...listUsers.value, ...exceptUsers];
    };
    const infiniteScroll = async () => {
      const listWrapper = document.getElementById("list-users");
      if (listWrapper) {
        const bottomOfWindow =
          Math.ceil(listWrapper.scrollTop) + listWrapper.clientHeight ===
          listWrapper.scrollHeight;
        if (bottomOfWindow) {
          if (totalUsers.value > listUsers.value.length) {
            const data = await callGetUsersForInvitation(request);
            totalUsers.value = data.totalCount;
            listUsers.value = [...listUsers.value, ...data.results];
          }
        }
      }
    };
    // Watch

    watch(showInviteUsersModal, (newValue) => {
      if (newValue == false) {
        listUsers.value = [];
      }
    });
    //Life circle hook

    return {
      invitationStore,
      userStore,
      listUsers,
      defaultAvatarURL,
      showInviteUsersModal,
      request,
      selectUser,
      onSearchSubmit,
      sendInvitation,
      openInviteUsersModal,
      infiniteScroll,
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
    &.hidden {
      visibility: hidden;
    }
    li {
      display: flex;
      gap: 5px;
      justify-content: space-between;
      // border: 1px solid black;
      padding: 5px;
      align-items: center;
      // box-shadow: 0px 0px 1px 1px var(--vt-c-blue-light-2);
      height: 50px;
      border-radius: 10px;
      overflow: hidden;
      grid-template-columns: 50px 1fr 50px;
      grid-template-rows: 50px;
      transition: all 0.3s ease;
      .user-infor {
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
        gap: 10px;
        justify-content: space-around;
        .image-overlay {
          height: 100%;
          border-radius: 50%;
          background-color: var(--vt-c-white-soft);
          overflow: hidden;
          border: 3px solid var(--vt-c-blue-light-2);
          padding: 3px;
          img {
            height: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            position: relative;
          }
        }
      }
      &.selected {
        background-color: rgb(110, 110, 110);
        box-shadow: 0px 0px 5px 5px var(--vt-c-blue-light-2);
        color: var(--vt-c-white-mute);
      }
      &:hover {
        background-color: var(--vt-c-list-item-bg-hover);
      }
      .icon {
        font-size: large;
        border-radius: 50%;
        box-shadow: 0px 0px 5px 5px var(--vt-c-blue-light-2);
      }
    }
  }
  .empty-list {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1em;
    .empty-icon {
      font-size: 2em;
      align-self: center;
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
