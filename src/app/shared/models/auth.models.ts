import { UserPayload } from "./user.models";

export interface LoginRequest {
  email: string;
  profile_password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserPayload;
}

