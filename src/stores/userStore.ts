import type { SignUpModel, User } from "./models/User";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";
import router from "@/router";

export type UserState = {
  user?: User;
  usersInRoom: User[];
};

const useUserStore = defineStore({
  id: "user",
  state: () =>
    ({
      user: undefined,
      usersInRoom: [],
      selectedUser: undefined,
    } as UserState),
  getters: {
    getUser: (state) => state.user,
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
    async fetchUsersInRoom(roomId: string) {
      const { data } = await ApiHelper.get(`${API_URL.USER}`);
      this.usersInRoom = data;
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
