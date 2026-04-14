import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoginRequest, LoginResponse, AuthResponse,Setup2FAResponse, ApiResponse } from '../../shared/models/auth.models';
import { UserPayload } from '../../shared/models/user.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageService = inject(MessageService);

  private readonly API_URL = 'http://localhost:3002/api/auth';

  // Signals de estado
  currentUser = signal<UserPayload | null>(null);
  isAuthenticated = signal<boolean>(false);
  
  // 🔥 Novo Signal para guardar o token temporário do 2FA
  // Não salvamos isso no LocalStorage por segurança!
  preAuthToken = signal<string | null>(null);

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('matia_token');
    const userStr = localStorage.getItem('matia_user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserPayload;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }


 // 1. Mude o retorno para Observable<AuthResponse>
login(credentials: LoginRequest): Observable<AuthResponse> {
  // 2. Mude o post para <AuthResponse>
  return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
    tap((response) => {
      // Cenário A: Verificamos se a propriedade exclusiva do 2FA existe no objeto
      if ('requires_2fa' in response) {
        this.preAuthToken.set(response.preAuthToken);
        this.messageService.add({
          severity: 'info',
          summary: '2FA Necessário',
          detail: 'Por favor, insira o código do seu autenticador.'
        });
        this.router.navigate(['/login-2fa']);
      } 
      // Cenário B: Se não caiu no IF acima, o TS agora entende que é um LoginResponse
      // Usamos 'token' in response para garantir a tipagem no else if
      else if ('token' in response) {
        this.finalizeLogin(response);
      }
    })
  );
}

  /**
   * FASE 2: Validação do código TOTP
   */
  login2FA(token2fa: string): Observable<LoginResponse> {
    const preToken = this.preAuthToken();
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login-2fa`, {
      preAuthToken: preToken,
      token2fa: token2fa
    }).pipe(
      tap((response) => {
        if (response.token && response.user) {
          this.finalizeLogin(response);
          this.preAuthToken.set(null); // Limpa o token temporário
        }
      })
    );
  }

  /**
   * Centraliza a gravação dos dados após sucesso total
   */
  private finalizeLogin(response: LoginResponse) {
    localStorage.setItem('matia_token', response.token);
    localStorage.setItem('matia_user', JSON.stringify(response.user));
    
    this.currentUser.set(response.user);
    this.isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('matia_token');
    localStorage.removeItem('matia_user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.preAuthToken.set(null);

    this.messageService.add({
      severity: 'info',
      summary: 'Sessão Encerrada',
      detail: 'Você saiu com segurança.',
      life: 3000
    });

    this.router.navigate(['/login']);
  }

  // 1. Pede o QR Code e garante que a resposta terá o formato Setup2FAResponse
  get2FASetup(): Observable<Setup2FAResponse> {
    return this.http.post<Setup2FAResponse>(`${this.API_URL}/setup-2fa`, {});
  }

  // 2. Envia o token e espera uma resposta padrão de sucesso
  enable2FA(token2fa: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/confirm-2fa`, { token: token2fa });
  }

  // 3. Desativa e espera uma resposta padrão de sucesso
 disable2FA(token2fa: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.API_URL}/disable-2fa`, { token: token2fa });
  }

  getToken(): string | null {
    return localStorage.getItem('matia_token');
  }
}