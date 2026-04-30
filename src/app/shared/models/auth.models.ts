import { UserPayload } from "./user.models";

export interface LoginRequest {
  email: string;
  profile_password: string;
}

// Resposta quando o usuário pede para gerar o QR Code
export interface Setup2FAResponse {
  qrcode: string; // O QR Code em base64
  manual_key?: string; // O manual key, se houver
}

// Opcional, mas recomendado para respostas genéricas de sucesso/erro
export interface ApiResponse {
  message: string;
  data?: any;
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

// Envia apenas o e-mail para receber o link
export interface ForgotPasswordRequest {
  email: string;
}

// O que é enviado quando o usuário clica no link do e-mail
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// O que é enviado quando o usuário logado quer trocar a senha
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// 🔥 O Tipo Unificado (Union Type) que o Service vai usar
export type AuthResponse = LoginResponse | PreAuthResponse;