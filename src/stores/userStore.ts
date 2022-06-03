import type { GetUserRequest, SignUpModel, User } from "./models/User";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";
import router from "@/router";
import useMessageStore from "./MessageStore";

export type UserState = {
  user?: User;
  usersInRoom: User[];
  allUsers: User[];
  users: User[];
};

const useUserStore = defineStore({
  id: "user",
  state: () =>
    ({
      user: undefined,
      usersInRoom: [],
      allUsers: [],
      users: [],
    } as UserState),
  getters: {
    totalUser: (state) => state.allUsers.length,
    totalUserInRoom: (state) => state.usersInRoom.length,
  },
  actions: {
    async SignIn(email: string, password: string) {
      const { data } = await ApiHelper.post(`${API_URL.AUTHENTICATE}/login`, {
        email,
        password,
      });
      document.cookie = data.token;
      this.user = data.user;

      router.push({ name: "home" });
    },

    async SignUp(model: SignUpModel) {
      await ApiHelper.post(`${API_URL.AUTHENTICATE}/register`, model).then(
        (res) => {
          if (res.data.id) {
            router.push({ name: "SignIn" });
          }
        }
      );
    },

    async fetchUsersInRoom() {
      const request: GetUserRequest = {
        currentItemsCount: this.usersInRoom ? this.usersInRoom.length : 0,
        currentPage: 0,
        isInfiniteScroll: false,
        isPaging: false,
        itemsPerPage: 10,
      };
      const messageStore = useMessageStore();
      const { data } = await ApiHelper.get(
        `${API_URL.USER}/room/${messageStore.selectedRoom?.id}`,
        {
          params: request,
        }
      );
      this.usersInRoom = data.results;
      return data;
    },

    async fetchUsers(values?: any) {
      const request: GetUserRequest = {
        currentItemsCount: this.users.length,
        currentPage: 0,
        isInfiniteScroll: false,
        isPaging: false,
        itemsPerPage: 10,
        ...values,
      };
      const { data } = await ApiHelper.get(`${API_URL.USER}`, {
        params: request,
      });
      this.users = data.results;
      return data;
    },

    async sendInvitation() {
      console.log();
    },
    setUser(value: User) {
      this.user = value;
    },

    setUsersInRoom(values: User[]) {
      this.usersInRoom = values;
    },
  },
});

// ChatHub.start();

export default useUserStore;
