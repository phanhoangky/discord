import {
  callForgotPassword,
  callResetPassword,
  callVerifyEmail,
} from "./services/AuthenticateStoreServices";
import { defineStore } from "pinia";
import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "./models/Authenticate";

const useAuthenticateStore = defineStore({
  id: "authenticate-store",
  actions: {
    async forgotPassword(email: string) {
      //
      const request: ForgotPasswordRequest = {
        email,
        isLoading: true,
        isNotify: true,
      };
      const data = await callForgotPassword(request);
      console.log(data);
      return data;
    },
    async resetPassword(request: ResetPasswordRequest) {
      const data = await callResetPassword(request);
      return data;
    },
    async verifyEmail(request: VerifyEmailRequest) {
      const data = await callVerifyEmail(request);
      return data;
    },
  },
});

export default useAuthenticateStore;
