import type { BaseRequest } from "./BaseModel";

export interface ResetPasswordRequest extends BaseRequest {
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ForgotPasswordRequest extends BaseRequest {
  email: string;
}

export interface VerifyEmailRequest extends BaseRequest {
  email: string;
  token: string;
}
