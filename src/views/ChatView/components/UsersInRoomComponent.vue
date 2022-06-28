<template>
  <div class="grid-block">
    <div class="header">
      <font-awesome-icon icon="people-group"></font-awesome-icon>
    </div>
    <section class="users-list-wrapper">
      <span>Onlines</span>
      <TransitionGroup name="list" tag="ul">
        <li
          v-for="user in onlineUsers"
          :key="user.id"
          @click="selectUser(user)"
          class="list-item"
          :class="{ selected: user.isSelected }"
        >
          <div class="image-overlay">
            <img
              :src="user.photoUrl != '' ? user.photoUrl : defaultAvatarURL"
            />
          </div>
          <div class="username">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="not-read">{{ user.notReadMessages }}</div>
        </li>
      </TransitionGroup>
      <span>Offlines</span>
      <TransitionGroup name="list" tag="ul">
        <li
          v-for="user in offlineUsers"
          :key="user.id"
          @click="selectUser(user)"
          class="list-item"
          :class="{ selected: user.isSelected }"
        >
          <div class="image-overlay">
            <img
              :src="user.photoUrl != '' ? user.photoUrl : defaultAvatarURL"
            />
          </div>
          <div class="username">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="not-read">{{ user.notReadMessages }}</div>
        </li>
      </TransitionGroup>
    </section>
    <Form
      :validation-schema="schema"
      @submit="searchUserByName"
      v-slot="{ resetForm }"
      ref="form"
    >
      <Field
        name="username"
        type="text"
        placeholder="....Username"
        @focusout="resetForm"
      ></Field>
    </Form>
  </div>
</template>

<script lang="ts">
import useMessageStore from "@/stores/MessageStore";
import useUserStore from "@/stores/UserStore";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useRoomStore } from "@/stores/RoomStore";
import type { User } from "@/stores/models/User";
export default defineComponent({
  setup() {
    const schema = yup.object({
      username: yup.string().max(50),
    });

    return { schema };
  },
  components: {
    Field,
    Form,
  },
  data: () => ({
    totalCount: 0,
  }),
  computed: {
    ...mapState(useUserStore, {
      users: "users",
      user: "user",
    }),
    ...mapState(useMessageStore, {
      selectedUser: "selectedUser",
      selectedRoom: "selectedRoom",
    }),
    defaultAvatarURL() {
      const imgUrl = new URL(
        "../../../assets/defaultuser.png",
        import.meta.url
      );
      return imgUrl.toString();
    },
    onlineUsers() {
      //
      const onlines = this.users.filter((u) => u.isOnline);
      return onlines;
    },
    offlineUsers() {
      const offlines = this.users.filter((u) => u.isOnline == false);
      return offlines;
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      fetchUsersInRoom: "fetchUsersInRoom",
      fetchUsers: "fetchUsers",
      updateNotReadMessageOfUser: "updateNotReadMessageOfUser",
    }),
    ...mapActions(useMessageStore, {
      setSelectedUser: "setSelectedUser",
    }),
    ...mapActions(useRoomStore, {
      setRoom: "setSelectedRoom",
    }),

    async searchUserByName(values: any) {
      // console.log(values, this.users);
      if (this.selectedRoom) {
        await this.fetchUsersInRoom(values);
      } else {
        await this.fetchUsers(values);
      }
    },
    async selectUser(item: User) {
      if (item.notReadMessages > 0) {
        if (this.user) {
          await this.updateNotReadMessageOfUser(this.user.id, item.id);
        }
      }
      this.setSelectedUser(item);
      this.setRoom(undefined);
      this.users = this.users.map((u) => {
        if (u.id == item.id) {
          u.isSelected = true;
        }
        if (u.id != item.id) {
          u.isSelected = false;
        }
        return u;
      });
    },
  },
  async created() {
    await this.fetchUsers();
  },
});
</script>

<style scoped lang="scss">
.grid-block {
  display: grid;
  grid-template-rows: 50px 1fr 50px;
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2em;
    color: var(--vt-c-navbar-text-color);
  }
  .users-list-wrapper {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    // padding: 5px;
    // padding-top: 10px;
    ul {
      padding: 5px;
      padding-top: 10px;
      li {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 1em 0;
        transition: all 0.5s ease;
        border-radius: 10px;
        overflow: hidden;
        gap: 10px;
        position: relative;
        color: var(--vt-c-list-item-text);
        &.selected {
          box-shadow: 0px 0px 5px 5px var(--vt-c-blue-light-2);
          transform: skewY(-5deg);
        }
        .not-read {
          position: absolute;
          right: 5px;
          width: 25px;
          aspect-ratio: 1 / 1;
          background-color: var(--vt-c-red-soft);
          box-shadow: 0px 0px 4px 4px var(--vt-c-red-soft);
          color: var(--vt-c-white-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        &:hover {
          background-color: var(--vt-c-divider-dark-2);
        }
        .image-overlay {
          flex-shrink: 0;
          width: 50px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background-color: var(--vt-c-white-soft);
          overflow: hidden;
          img {
            width: 100%;
          }
        }

        .username {
          flex: 4;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  form {
    flex: 1;
    input {
      height: 100%;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
    }
  }
}
</style>
