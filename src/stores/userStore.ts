import type { SignUpModel } from "./models/User";
import { defineStore } from "pinia";
import ApiHelper from "@/api";
import { API_URL } from "./Constant";
import router from "@/router";
export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    User: {
      id: "",
      email: "",
      lastname: "",
      firstname: "",
      photoUrl: "",
    },
  }),
  getters: {
    getUser: (state) => state.User,
  },
  actions: {
    async SignIn(email: string, password: string) {
      console.log(email, password);
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
  },
});
