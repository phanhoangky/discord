import type { BaseGetRequest } from "./BaseModel";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string;
  phoneNumber: string;
  createdTime: string;
  updatedTime: string;
  isActive: boolean;
  isSelected?: boolean;
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

export interface UpdateUserProfileRequest {
  fullname?: string;
  photoUrl?: string;
  phoneNumber?: string;
}
