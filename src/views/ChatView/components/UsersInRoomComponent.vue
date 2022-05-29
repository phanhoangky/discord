<template>
  <section v-for="user in usersInRoom" :key="user.id">
    <img src="@/assets/logo.svg" />
    <div class="username" @click="selectUser(user)">
      {{ user.firstName }} {{ user.lastName }}
    </div>
  </section>
</template>

<script lang="ts">
import useMessageStore from "@/stores/MessageStore";
import type { User } from "@/stores/models/User";
import useUserStore from "@/stores/UserStore";
import { mapActions, mapState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
  computed: {
    ...mapState(useUserStore, {
      usersInRoom: "usersInRoom",
    }),
    listUsers(): User[] {
      return [];
    },
  },
  methods: {
    ...mapActions(useUserStore, {
      fetchUsersInRoom: "fetchUsersInRoom",
    }),
    ...mapActions(useMessageStore, {
      setSelectedUser: "setSelectedUser",
    }),
    selectUser(user: User) {
      this.setSelectedUser(user);
    },
  },
  async created() {
    await this.fetchUsersInRoom("asd");
  },
});
</script>

<style scoped lang="scss">
section {
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
</style>
