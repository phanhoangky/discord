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
import { callGetUserByRoom } from "./services/UserStoreServices";

export type UserState = {
  user?: User;
  users: User[];
  fetchUsersInvitationRequest: GetUserRequest;
  fetchUsersInRoomRequest: GetUserRequest;
};

const useUserStore = defineStore({
  id: "user",
  state: () =>
    ({
      user: undefined,
      users: [],
      fetchUsersInvitationRequest: {
        currentItemsCount: 0,
        currentPage: 0,
        isInfiniteScroll: false,
        isLoading: true,
        isPaging: false,
        itemsPerPage: 10,
        searchName: "",
      },
      fetchUsersInRoomRequest: {
        currentItemsCount: 0,
        currentPage: 0,
        isInfiniteScroll: false,
        isLoading: true,
        isPaging: false,
        itemsPerPage: 10,
        searchName: "",
      },
    } as UserState),

  actions: {
    async SignIn(email: string, password: string) {
      const { data } = await ApiHelper.post(`${API_URL.AUTHENTICATE}/login`, {
        email,
        password,
        isLoading: true,
      });
      document.cookie = data.token;
      this.user = data.user;
      router.push({ name: "home" });
    },

    async SignUp(model: SignUpModel) {
      await ApiHelper.post(`${API_URL.AUTHENTICATE}/register`, {
        ...model,
        isLoading: true,
      }).then((res) => {
        if (res.data.id) {
          router.push({ name: "SignIn" });
        }
      });
    },
    logout() {
      document.cookie = "";
      this.$patch({
        user: undefined,
      });
      router.push("/sign-in");
    },
    async fetchUsersInRoom(params?: any) {
      const request: GetUserRequest = {
        currentItemsCount: this.user ? this.users.length : 0,
        currentPage: 0,
        isInfiniteScroll: false,
        isPaging: false,
        itemsPerPage: 10,
        isLoading: true,
        ...params,
      };
      const messageStore = useMessageStore();
      const data = await callGetUserByRoom(
        request,
        messageStore.selectedRoom?.id
      );
      console.log("[Fetch UserInRoom] >>>>", data);

      this.$patch({
        users: data.results,
      });
      return data;
    },

    async fetchUsers(params?: any) {
      const request: GetUserRequest = {
        currentItemsCount: this.users ? this.users.length : 0,
        currentPage: 0,
        isInfiniteScroll: false,
        isPaging: false,
        isLoading: true,
        itemsPerPage: 10,
        ...params,
      };
      const { data } = await ApiHelper.get(`${API_URL.USER}`, {
        params: request,
      });
      this.$patch({
        users: data.results,
      });
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
      this.$patch({
        user: { ...this.user, ...value },
      });
    },
  },
});

// ChatHub.start();

export default useUserStore;
