import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-assinaturas',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DividerModule, TagModule],
  templateUrl: './assinaturas.html',
  styleUrls: ['./assinaturas.scss']
})
export class Assinaturas {
  // Aqui você pode depois carregar esses dados de um Service
  planos = [
    {
      nome: 'Bronze',
      preco: '99',
      subtitulo: 'Ideal para advogados autônomos',
      caracteristicas: ['50 Consultas Jurídicas/mês', '1 Usuário', 'Suporte via E-mail'],
      destaque: false,
      corBotao: 'secondary'
    },
    {
      nome: 'Prata',
      preco: '199',
      subtitulo: 'Para escritórios em crescimento',
      caracteristicas: ['Consultas Ilimitadas', 'Até 5 Usuários', 'IA Jurídica Avançada', 'Suporte Prioritário'],
      destaque: true,
      corBotao: 'primary'
    },
    {
      nome: 'Ouro',
      preco: '499',
      subtitulo: 'Solução completa corporativa',
      caracteristicas: ['Tudo do Prata', 'Usuários Ilimitados', 'Treinamento VIP', 'API de Integração'],
      destaque: false,
      corBotao: 'help'
    }
  ];
}