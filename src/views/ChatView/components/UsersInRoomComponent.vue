<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="user in listUsers" :key="user.id" @click="selectUser(user)">
      <img src="@/assets/logo.svg" />
      <div class="username">{{ user.firstName }} {{ user.lastName }}</div>
    </li>
  </TransitionGroup>
  <Form :validation-schema="schema" @submit.prevent="searchUserByName">
    <Field name="username"></Field>
  </Form>
</template>

<script lang="ts">
import useMessageStore from "@/stores/MessageStore";
import type { User } from "@/stores/models/User";
import useUserStore from "@/stores/UserStore";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
export default defineComponent({
  setup() {
    const userStore = useUserStore();
    const messageStore = useMessageStore();
    const schema = yup.object({
      username: yup.string().max(50),
    });
    messageStore.$subscribe(async (mutation, state) => {
      console.log("[UserInRoom] >>>", mutation);
      if (state.selectedRoom != null) {
        await userStore.fetchUsersInRoom();
      }
      if (!state.selectedRoom && !state.selectedUser) {
        await userStore.fetchUsers();
      }
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
    }),
    ...mapActions(useMessageStore, {
      setSelectedUser: "setSelectedUser",
    }),
    searchUserByName(values: any) {
      console.log(values);
    },
    selectUser(user: User) {
      this.setSelectedUser(user);
    },
  },
  async created() {
    // const data = await this.fetchUsers();
    // console.log(data);
    // this.totalCount = data.totalCount;
  },
});
</script>

<style scoped lang="scss">
ul {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em 0;
    transition: all 0.5s ease;
    border-radius: 10px;
    overflow: hidden;
    &:hover {
      background-color: var(--vt-c-divider-dark-2);
    }
    img {
      width: 50px;
      aspect-ratio: 1 / 1;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .username {
      flex-grow: 8;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

form {
  flex: 1;
}
</style>
