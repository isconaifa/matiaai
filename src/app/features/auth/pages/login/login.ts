import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { LoginRequest } from '../../../../shared/models/auth.models';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  imports: [ButtonModule, InputTextModule, RippleModule, ReactiveFormsModule, PasswordModule, ToastModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Injeção de dependências moderna (sem construtor)
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  showPassword = false;

  // Signal para controlar o estado de "Carregando" no botão
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Criação do formulário com as validações
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    profile_password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Pegamos os valores tipados do formulário
    const credentials = this.loginForm.value as LoginRequest;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.messageService.add({ 
        severity: 'success', 
        summary: 'Bem-vindo!', 
        detail: 'Login realizado com sucesso.',
        life: 3000 // Tempo em milisegundos (3 segundos)
      });
        this.isLoading.set(false);
        // Se deu sucesso, manda o usuário para o Dashboard!
        this.router.navigate(['/matia/dashboard']); 
      },
      error: (error) => {
        this.isLoading.set(false);
        // Trata o erro (ex: senha errada ou usuário não existe)
        this.errorMessage.set(error.error?.message || 'Erro ao tentar fazer login. Verifique suas credenciais.');
        console.error('Erro no login:', error);
      }
    });
  }


 
}