import type { SignUpModel, User } from "./models/User";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";
import router from "@/router";

export type UserState = {
  user?: User;
};

export const useUserStore = defineStore({
  id: "user",
  state: () =>
    ({
      user: undefined,
    } as UserState),
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    async SignIn(email: string, password: string) {
      console.log(email, password);
      const { data } = await ApiHelper.post(`${API_URL.AUTHENTICATE}/login`, {
        email,
        password,
      });
      console.log("[SignIn] >>>", data);
      document.cookie = data.token;
      this.user = data.user;
      console.log("[Cookie] >>>>", document.cookie);

      router.push({ name: "home" });
    },
    async SignUp(model: SignUpModel) {
      console.log(model);
      // const { data } = await ApiHelper.post(
      //   `${API_URL.AUTHENTICATE}/register`,
      //   { ...model }
      // );
      await ApiHelper.post(`${API_URL.AUTHENTICATE}/register`, model).then(
        (res) => {
          console.log(res);
          console.log("[Created]", res);

          if (res.data.id) {
            router.push({ name: "SignIn" });
          }
        }
      );
    },
    setUser(value: User) {
      this.user = value;
    },
  },
});
