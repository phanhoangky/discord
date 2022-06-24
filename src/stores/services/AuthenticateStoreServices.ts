import ApiHelper from "@/api";
import { API_URL } from "../Constant";
import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from "../models/Authenticate";

export const callForgotPassword = async (request: ForgotPasswordRequest) => {
  //
  const base: ForgotPasswordRequest = {
    isLoading: true,
    isNotify: true,
    ...request,
  };
  const { data } = await ApiHelper.post(
    `${API_URL.AUTHENTICATE}/forgot-password`,
    base
  );
  return data;
};

export const callResetPassword = async (request: ResetPasswordRequest) => {
  const base: ResetPasswordRequest = {
    ...request,
    isLoading: true,
    isNotify: true,
  };
  const { data } = await ApiHelper.post(
    `${API_URL.AUTHENTICATE}/reset-password`,
    base
  );
  return data;
};

export const callVerifyEmail = async (request: VerifyEmailRequest) => {
  const base: VerifyEmailRequest = {
    isLoading: true,
    isNotify: true,
    ...request,
  };
  const { data } = await ApiHelper.post(
    `${API_URL.AUTHENTICATE}/verify-email`,
    base
  );
  return data;
};
