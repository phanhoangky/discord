<template>
  <div class="grid-block">
    <div class="header">
      <font-awesome-icon icon="people-group"></font-awesome-icon>
    </div>
    <TransitionGroup name="list" tag="ul">
      <li v-for="user in listUsers" :key="user.id" @click="selectUser(user)">
        <img src="@/assets/logo.svg" />
        <div class="username">{{ user.firstName }} {{ user.lastName }}</div>
      </li>
    </TransitionGroup>
    <Form
      :validation-schema="schema"
      @submit="searchUserByName"
      v-slot="{ resetForm }"
      ref="form"
    >
      <Field
        name="username"
        placeholder="....Username"
        @focusout="resetForm"
      ></Field>
    </Form>
  </div>
</template>

<script lang="ts">
import useMessageStore from "@/stores/MessageStore";
import type { User } from "@/stores/models/User";
import useUserStore from "@/stores/UserStore";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { useRoomStore } from "@/stores/RoomStore";
export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const messageStore = useMessageStore();
    const schema = yup.object({
      username: yup.string().max(50),
    });

    // messageStore.$subscribe(async (mutation, state) => {
    //   console.log("[UserInRoom] >>>", "", mutation);
    //   if (!messageStore.selectedRoom && !messageStore.selectedUser) {
    //     console.log("[UserInRoom] >>>", "All User", mutation);
    //     await userStore.fetchUsers();
    //   }
    //   if (mutation.events.target.selectedRoom && messageStore.selectedRoom) {
    //     console.log("[UserInRoom] >>>", "SelectedRoom", mutation);
    //     await userStore.fetchUsersInRoom();
    //   }
    // });
    // messageStore.$onAction((context) => {
    //   console.log("Message Store Action>>>>>>", context);
    // });
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
      usersInRoom: "usersInRoom",
      users: "users",
    }),
    ...mapState(useMessageStore, {
      selectedUser: "selectedUser",
      selectedRoom: "selectedRoom",
    }),
    listUsers(): User[] {
      if (this.selectedRoom) {
        return this.usersInRoom;
      }
      return this.users;
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      fetchUsersInRoom: "fetchUsersInRoom",
      fetchUsers: "fetchUsers",
      setUser: "setUser",
    }),
    ...mapActions(useMessageStore, {
      setSelectedUser: "setSelectedUser",
    }),
    ...mapActions(useRoomStore, {
      setRoom: "setSelectedRoom",
    }),
    async searchUserByName(values: any) {
      console.log(values, this.listUsers);
      if (this.selectedRoom) {
        await this.fetchUsersInRoom(...values);
      } else {
        await this.fetchUsers(values);
      }
    },
    selectUser(user: any) {
      this.setSelectedUser(user);
      this.setRoom(undefined);
    },
  },
  async created() {
    const data = await this.fetchUsers();
    console.log(data);
    // this.totalCount = data.totalCount;
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
  }
  ul {
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    li {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 1em 0;
      transition: all 0.5s ease;
      border-radius: 10px;
      overflow: hidden;
      gap: 10px;
      &:hover {
        background-color: var(--vt-c-divider-dark-2);
      }
      img {
        flex: 1;
        width: 50px;
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
      }
      .username {
        flex: 4;
        overflow: hidden;
        text-overflow: ellipsis;
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
