<template>
  <div class="grid-block">
    <div class="header">
      <font-awesome-icon icon="people-group"></font-awesome-icon>
    </div>
    <TransitionGroup name="list" tag="ul">
      <li v-for="user in users" :key="user.id" @click="selectUser(user)">
        <div class="image-overlay">
          <img :src="user.photoUrl != '' ? user.photoUrl : defaultAvatarURL" />
        </div>
        <div class="username">{{ user.firstName }} {{ user.lastName }}</div>
        <div class="not-read">{{ user.notReadMessages }}</div>
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
  },
  methods: {
    ...mapActions(useUserStore, {
      fetchUsersInRoom: "fetchUsersInRoom",
      fetchUsers: "fetchUsers",
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
      position: relative;
      .not-read {
        position: absolute;
        right: 5px;
        width: 25px;
        aspect-ratio: 1 / 1;
        background-color: var(--vt-c-red-soft);
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
