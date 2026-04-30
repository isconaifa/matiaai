import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext'; // Importante para o campo de email
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, 
    RouterModule, 
    ButtonModule, 
    InputTextModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  forgotForm: FormGroup;
  isLoading = false;
  emailSent = false; // Controla se mostramos o form ou a mensagem de sucesso

  constructor() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const email = this.forgotForm.get('email')?.value;

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.emailSent = true; // Muda a tela para mostrar a mensagem de sucesso
      },
      error: (err) => {
        this.isLoading = false;
        // Por segurança, mesmo que dê erro (ex: email não existe), 
        // muitas empresas preferem não avisar para evitar rastreamento de emails válidos.
        // Mas se quiser exibir o erro:
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível processar sua solicitação. Tente novamente mais tarde.'
        });
      }
    });
  }
}


