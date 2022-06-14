import type {
  GetUserRequest,
  SignUpModel,
  UpdateUserProfileRequest,
  User,
} from "./models/User";
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
    async logout() {
      document.cookie = "";
      this.$patch({
        user: undefined,
      });
      router.push("/sign-in");
    },
    async fetchUsersInRoom(username?: string) {
      const request: GetUserRequest = {
        currentItemsCount: this.usersInRoom ? this.usersInRoom.length : 0,
        currentPage: 0,
        isInfiniteScroll: false,
        isPaging: false,
        itemsPerPage: 10,
        searchName: username,
      };
      const messageStore = useMessageStore();
      const { data } = await ApiHelper.get(
        `${API_URL.USER}/room/${messageStore.selectedRoom?.id}`,
        {
          params: request,
        }
      );
      console.log("[Fetch UserInRoom] >>>>", data);

      this.usersInRoom = data.results;
      return data;
    },

    async fetchUsers(values?: any) {
      const request: GetUserRequest = {
        currentItemsCount: this.users ? this.users.length : 0,
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

    async fetchUserById(id: string) {
      const { data } = await ApiHelper.get(`${API_URL.USER}/${id}`);
      console.log(data);
    },
    async updateUserProfile(request: UpdateUserProfileRequest) {
      const { data } = await ApiHelper.put(`${API_URL.USER}`, request);
      this.$patch({
        user: data,
      });
    },
    setUser(value: any) {
      // this.user = {
      //   ...this.user,
      //   ...value,
      // };
      this.$patch({
        user: { ...this.user, ...value },
      });
    },

    setUsersInRoom(values: User[]) {
      // this.usersInRoom = values;
      this.$patch({
        usersInRoom: values,
      });
    },
  },
});

// ChatHub.start();

export default useUserStore;
