export interface User {
  user_id?: number;
  username: string;
  password?: string;
  email?: string;
  full_name?: string;
  time_created?: Date;
}

export interface Profile {
  user_id?: number;
  username: string;
  email?: string;
  full_name?: string;
  filename?: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user_id: number;
}

export interface UserCheck {
  username: string;
  available: boolean;
}

export interface ProfileEdit {
  username?: string;
  email?: string;
  password?: string;
}

export interface EditResponse {
  message: string;
}
