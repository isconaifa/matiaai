import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoginRequest, LoginResponse } from '../../shared/models/auth.models';
import { UserPayload } from '../../shared/models/user.models';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // 1. Injeção de dependências moderna
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // 2. URL da API no Docker
  private readonly API_URL = 'http://localhost:3002/api/auth';

  // 3. Signals para estado reativo super rápido
  currentUser = signal<UserPayload | null>(null);
  isAuthenticated = signal<boolean>(false);

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Verifica se o usuário já fez login antes (F5 na página)
   */
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
 // Envia as credenciais para o Docker e salva o retorno
   login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        if (response.success && response.token && response.user) {
          // Salva no navegador
          localStorage.setItem('matia_token', response.token);
          localStorage.setItem('matia_user', JSON.stringify(response.user));
          
          // Atualiza o estado da aplicação
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
        }
      })
    );
  }


  /**
   * Limpa os dados e joga para a tela de login
   */logout(): void {
  // 1. Limpa o armazenamento físico
  localStorage.removeItem('matia_token');
  localStorage.removeItem('matia_user');

  // 2. Atualiza os Signals (isso faz sumir o nome do usuário da tela na hora)
  this.currentUser.set(null);
  this.isAuthenticated.set(false);

  // 3. Exibe o Toast de despedida
  this.messageService.add({
    severity: 'info',
    summary: 'Sessão Encerrada',
    detail: 'Você saiu do sistema com segurança.',
    life: 3000
  });

  // 4. Redireciona
  this.router.navigate(['/matia/login']);
}

  // Pega o token atual (Será usado no Interceptor depois)
  getToken(): string | null {
    return localStorage.getItem('matia_token');
  }
}
