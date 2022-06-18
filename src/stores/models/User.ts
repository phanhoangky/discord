import type { BaseGetRequest, BaseRequest } from "./BaseModel";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  file?: File;
  phoneNumber: string;
  gender?: string;
  dateOfBirth?: Date;
  createdTime: string;
  updatedTime: string;
  isActive: boolean;
  isSelected?: boolean;
  notReadMessages: number;
}

export interface SignUpModel {
  email: string;
  lastname?: string;
  firstname?: string;
  password: string;
}

export interface GetUserRequest extends BaseGetRequest {
  searchName?: string;
}

export interface UpdateUserProfileRequest extends BaseRequest {
  id: string;
  firstname?: string;
  lastname?: string;
  photoUrl?: string;
  file?: File;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: Date;
}
