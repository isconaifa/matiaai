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