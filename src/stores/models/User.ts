export interface User {
  id: string;
  name: string;
  photoUrl: string;
}

export interface SignUpModel {
  email: string;
  lastname?: string;
  firstname?: string;
  password: string;
}
