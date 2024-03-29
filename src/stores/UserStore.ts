import type {
  GetUserRequest,
  SignUpModel,
  UpdateNotReadMessageOfUser,
  UpdateUserProfileRequest,
  User,
} from "./models/User";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";
import router from "@/router";
import useMessageStore from "./MessageStore";
import {
  callGetUserByRoom,
  callUpdateNotReadMessageOfUser,
} from "./services/UserStoreServices";
import { fetchFileURL, refFile, uploadFile } from "@/utilities/Firebase";
import moment from "moment";
import { deleteCookiee, setCookie } from "@/components/common/common";

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
      // document.cookie = data.token;
      setCookie("apiToken", data.token, 1);
      this.user = {
        ...data.user,
        dateOfBirth: data.user.dateOfBirth
          ? moment(data.user.dateOfBirth).format("YYYY-MM-DD")
          : moment(new Date()).format("YYYY-MM-DD"),
        phoneNumber: data.user.phoneNumber ? data.user.phoneNumber : "",
      };
      router.push({ name: "home" });
    },

    async SignUp(model: SignUpModel) {
      await ApiHelper.post(`${API_URL.AUTHENTICATE}/register`, {
        ...model,
        isLoading: true,
      });

      // if (data) {
      router.push({ name: "ConfirmEmail" });
      // }
    },
    logout() {
      // document.cookie = "";
      deleteCookiee("apiToken");
      this.$patch({
        user: undefined,
      });
      router.push("/sign-in");
    },
    async fetchUsersInRoom(params?) {
      const request: GetUserRequest = {
        currentItemsCount: this.user ? this.users.length : 0,
        currentPage: 0,
        isInfiniteScroll: false,
        isPaging: false,
        itemsPerPage: 10,
        isLoading: true,
        isNotify: false,
        ...params,
      };
      const messageStore = useMessageStore();
      const data = await callGetUserByRoom(
        request,
        messageStore.selectedRoom?.id
      );
      // console.log("[Fetch UserInRoom] >>>>", data);

      this.$patch({
        users: data.results,
      });
      return data;
    },

    async fetchUsers(params?) {
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
      const userStore = useUserStore();
      if (request.file) {
        const fileRef = refFile(`${userStore.user?.id}/${request.file.name}`);
        await uploadFile(fileRef.fullPath, request.file);
        const url = await fetchFileURL(fileRef.fullPath);
        request.photoUrl = url;
      }
      let { data } = await ApiHelper.put(`${API_URL.USER}/${request.id}`, {
        ...request,
        isLoading: true,
      });
      data = {
        ...data,
        dateOfBirth: moment(data.dateOfBirth).format("YYYY-MM-DD"),
      };
      this.$patch({
        user: data,
      });
      return data;
    },
    async updateNotReadMessageOfUser(currentUserId: string, senderId: string) {
      //
      const request: UpdateNotReadMessageOfUser = {
        currentUserId,
        senderId,
        isLoading: false,
        isNotify: false,
      };
      const data = await callUpdateNotReadMessageOfUser(request);
      this.$patch({
        users: this.users.map((u) => {
          if (u.id == data.id) {
            return data;
          }
          return u;
        }),
      });
      return data;
    },
    onUserOnline(userId: string) {
      //
      if (this.users.some((u) => u.id == userId)) {
        this.$patch({
          users: this.users.map((u) => {
            if (u.id == userId) {
              u.isOnline = true;
            }
            return u;
          }),
        });
      }
    },
    onUserOffline(userId: string) {
      //
      if (this.users.some((u) => u.id == userId)) {
        this.$patch({
          users: this.users.map((u) => {
            if (u.id == userId) {
              u.isOnline = false;
            }
            return u;
          }),
        });
      }
    },
    setUser(value) {
      this.$patch({
        user: { ...this.user, ...value },
      });
    },
  },
});

// ChatHub.start();

export default useUserStore;
