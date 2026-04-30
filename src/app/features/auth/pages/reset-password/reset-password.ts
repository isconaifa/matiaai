import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

// Importações do PrimeNG
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [RouterModule, PasswordModule, ButtonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.scss'],

})
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  resetForm!: FormGroup;
  token: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    // 1. Captura o token da URL (ex: localhost:4200/reset-password?token=abc123)
    this.token = this.route.snapshot.queryParamMap.get('token');
/*
    // Se o usuário acessar a rota sem token, joga de volta pro login
    if (!this.token) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Erro', 
        detail: 'Link inválido ou ausente. Solicite uma nova recuperação.' 
      });
      this.router.navigate(['/login']);
      return;
    }
*/
    // 2. Inicializa o formulário
    this.initForm();
    
  }

  private initForm(): void {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // 3. Validador customizado: garante que as duas senhas são idênticas
  private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    
    // Se não baterem, retorna um erro 'passwordMismatch' no formulário
    return password === confirm ? null : { passwordMismatch: true };
  }

  // 4. Envia para o Backend
  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) {
      // Força a exibição dos erros (mensagens em vermelho) na tela
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const newPassword = this.resetForm.get('newPassword')?.value;

    this.authService.resetPassword({ token: this.token, newPassword }).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: response.message || 'Senha alterada com sucesso. Você já pode fazer login.'
        });
        
        // Joga o usuário para o login após sucesso
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Falha na recuperação',
          detail: err.error?.message || 'O link pode ter expirado. Tente novamente.'
        });
      }
    });
  }
}