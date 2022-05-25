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
}

export interface SignUpModel {
  email: string;
  lastname?: string;
  firstname?: string;
  password: string;
}
