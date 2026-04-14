import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';


//Imports de pipes
import { BrDatePipe } from '../../../../shared/pipes/br-date-pipe';
import { BrlCurrencyPipe } from '../../../../shared/pipes/brl-currency-pipe';

// Imports dos seus Services e Models
import { AuthService } from '../../../../core/services/auth.service';
import { UserService } from '../../../../core/services/user.service';
import { UserProfile, UserProfileUpdate, ActivityHistory } from '../../../../shared/models/user.models';

// Imports do PrimeNG
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputOtpModule } from 'primeng/inputotp';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

interface Permissao {
  label: string;
  ativo: boolean;
}

interface AreaJuridica {
  nome: string;
  cor: string;
  ativo: boolean;
  permissoes: Permissao[];
}

interface Atividade {
  id: number;
  tipo: string;
  icone: string;
  titulo: string;
  detalhe: string;
  tempo: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputOtpModule,
    InputTextModule,
    ToastModule,
    BrDatePipe,
    BrlCurrencyPipe
  ],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
})
export class Perfil implements OnInit {

  // Injeções de dependência
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private messageService = inject(MessageService);

  // Variáveis de UI: Senha
  showAtual = false;
  showNova = false;
  showConfirm = false;
  forca = 0;
  forcaLabel = '—';
  forcaClasse = '';
  forcaCor = '';

  // Variáveis de Estado do 2FA (Ativação)
  is2FAEnabled: boolean = false;
  displayModal2FA: boolean = false;
  qrCodeImage: string | null = null;
  setupOtpValue: string = '';

  // Variáveis adicionais para o Modal de Desativação
  displayModalDisable2FA: boolean = false;
  disableOtpValue: string = '';

  // Dados do Usuário
  userProfile: UserProfile | null = null;

  // Arrays
  areas: AreaJuridica[] = [];
  atividades: ActivityHistory[] = [];

  ngOnInit(): void {
    // 1. Pegamos IMEDIATAMENTE os dados básicos que o Login salvou no Signal
    const usuarioLogado = this.authService.currentUser();
    if (usuarioLogado) {
    // Preenchemos a tela com o que já temos (Nome, Email, Role)
    this.userProfile = {
      ...this.userProfile,
      nome: usuarioLogado.nome,
      email: usuarioLogado.email,
      role: usuarioLogado.role,
      empresa_id: usuarioLogado.empresa_id
    } as UserProfile;
  }
    this.carregarDadosDoUsuario();
  }

  carregarDadosDoUsuario() {
    this.userService.getProfile().subscribe({
      next: (user: UserProfile) => {
        this.userProfile = user;
        this.is2FAEnabled = user.two_factor_enabled;
      },
      error: (err) => {
        this.mostrarToast('error', 'Erro', 'Não foi possível carregar os dados do perfil.');
      }
    });
  }

  // ==========================================
  // FLUXO 2FA - ATIVAÇÃO
  // ==========================================

  abrirSetup2FA() {
    this.displayModal2FA = true;
    this.setupOtpValue = '';
    this.qrCodeImage = null;

    this.authService.get2FASetup().subscribe({
      next: (res) => {
        this.qrCodeImage = res.qrcode;
      },
      error: (err) => {
        this.displayModal2FA = false;
        this.mostrarToast('error', 'Falha', 'Erro ao gerar QR Code. Tente novamente.');
      }
    });
  }
  carregarHistorico() {
  this.userService.getActivityHistory().subscribe({
    next: (data) => {
      this.atividades = data;
    },
    error: () => {
      this.mostrarToast('error', 'Erro', 'Não foi possível carregar o histórico.');
    }
  });
}

  // Mantenha apenas para o feedback visual por enquanto
  salvarSenha() {
    this.mostrarToast('info', 'Aviso', 'A alteração de senha estará disponível em breve.');
  }

  confirmarAtivacao() {
    if (this.setupOtpValue.length < 6) return;

    this.authService.enable2FA(this.setupOtpValue).subscribe({
      next: (res) => {
        this.is2FAEnabled = true;
        this.displayModal2FA = false;
        this.mostrarToast('success', 'Segurança', 'Autenticação 2FA ativada com sucesso!');
      },
      error: (err) => {
        this.setupOtpValue = '';
        const msg = err.error?.message || 'Código inválido ou expirado.';
        this.mostrarToast('error', 'Código Inválido', msg);
      }
    });
  }

  // ==========================================
  // FLUXO 2FA - DESATIVAÇÃO
  // ==========================================

  abrirDesativar2FA() {
    this.displayModalDisable2FA = true;
    this.disableOtpValue = '';
  }

  confirmarDesativacao() {
    if (this.disableOtpValue.length < 6) return;

    this.authService.disable2FA(this.disableOtpValue).subscribe({
      next: (res) => {
        this.is2FAEnabled = false;
        this.displayModalDisable2FA = false;
        this.mostrarToast('info', 'Aviso', 'Autenticação 2FA foi desativada com segurança.');
      },
      error: (err) => {
        this.disableOtpValue = ''; // Limpa o campo para o usuário tentar de novo
        const msg = err.error?.message || 'Código inválido ou expirado.';
        this.mostrarToast('error', 'Erro', msg);
      }
    });
  }

  // ==========================================
  // UTILITÁRIOS DA TELA
  // ==========================================

  checarForca(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    if (!val) { this.forca = 0; this.forcaLabel = '—'; this.forcaCor = ''; return; }

    const forte = val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val) && /[^A-Za-z0-9]/.test(val);
    const medio = val.length >= 6 && (/[A-Z]/.test(val) || /[0-9]/.test(val));

    if (forte) {
      this.forca = 3; this.forcaLabel = 'Forte';
      this.forcaClasse = 'strong'; this.forcaCor = '#10b981';
    } else if (medio) {
      this.forca = 2; this.forcaLabel = 'Médio';
      this.forcaClasse = 'medium'; this.forcaCor = '#c9a227';
    } else {
      this.forca = 1; this.forcaLabel = 'Fraco';
      this.forcaClasse = 'weak'; this.forcaCor = '#f87171';
    }
  }

  // Função para salvar os Dados Pessoais
  salvarDadosPessoais() {
    if (!this.userProfile) return;

    // Montamos o objeto de update conforme sua interface UserProfileUpdate
    const dadosParaAtualizar: UserProfileUpdate = {
      nome: this.userProfile.nome,
      email: this.userProfile.email,
      telefone: this.userProfile.telefone,
      area_juridica: this.userProfile.area_juridica || undefined
    };

    this.userService.updateProfile(dadosParaAtualizar).subscribe({
      next: (res) => {
        this.mostrarToast('success', 'Sucesso', 'Dados atualizados com sucesso!');
        // Opcional: recarregar os dados para garantir sincronia
        this.carregarDadosDoUsuario();
      },
      error: (err) => {
        const msg = err.error?.message || 'Erro ao atualizar dados.';
        this.mostrarToast('error', 'Erro', msg);
      }
    });
  }

  private mostrarToast(severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail, life: 4000 });
  }
}