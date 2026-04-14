import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
// PrimeNG
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-two-factor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    InputOtpModule, 
    ButtonModule, 
    ToastModule
  ],
  templateUrl: './login-two-factor.html',
  styleUrl: './login-two-factor.scss',
})
export class LoginTwoFactor implements OnInit {
  // 1. Injeções de dependência modernas
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // 2. Estado reativo com Signals e variáveis simples para o OTP
  otpValue: string = '';
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    // 🛡️ Segurança: Se o usuário tentar acessar a rota direto e não tiver o preAuthToken,
    // nós mandamos ele de volta para o início do login.
    
    if (!this.authService.preAuthToken()) {
      this.router.navigate(['/login']);
    }
      
  }

    //Monitora a digitação. Quando chegar em 6 dígitos, valida automaticamente.
  onOtpChange(event: any) {
    if (this.otpValue && this.otpValue.length === 6) {
      this.verifyOtp();
    }
  }
    //Chama o serviço para validar o código no backend
  verifyOtp(): void {
    if (this.otpValue.length < 6) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login2FA(this.otpValue).subscribe({
      next: (res) => {
        this.messageService.add({ 
          severity: 'success', 
          summary: 'Acesso Autorizado', 
          detail: 'Bem-vindo ao sistema MATIA!' 
        });
        // Pequeno delay para o usuário ver o feedback de sucesso
        setTimeout(() => {
          this.router.navigate(['/matia/chat']);
        }, 800);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.otpValue = ''; // Limpa os campos para o usuário tentar de novo
        
        const msg = err.error?.message || 'Código inválido ou expirado.';
        this.errorMessage.set(msg);
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Erro de Validação', 
          detail: msg 
        });
      }
    });
  }

    //Reseta o processo de login e volta para a tela inicial
  backToLogin(): void {
    this.authService.logout(); 
  }
}