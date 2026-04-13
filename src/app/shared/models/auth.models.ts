import { UserPayload } from "./user.models";

export interface LoginRequest {
  email: string;
  profile_password: string;
}

// Resposta final de sucesso (Login direto ou após 2FA)
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: UserPayload;
}

// 🔥 Nova interface para o estado intermediário do 2FA
export interface PreAuthResponse {
  success: boolean;
  requires_2fa: boolean;
  preAuthToken: string;
  message: string;
}

// 🔥 O Tipo Unificado (Union Type) que o Service vai usar
export type AuthResponse = LoginResponse | PreAuthResponse;