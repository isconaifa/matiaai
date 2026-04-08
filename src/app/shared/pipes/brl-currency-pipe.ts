import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brlCurrency',
  standalone: true // Mantendo o padrão moderno do seu projeto
})
export class BrlCurrencyPipe implements PipeTransform {

  /**
   * Transforma um valor numérico ou string em formato de moeda BRL (R$)
   * @param value O valor a ser formatado
   * @returns String formatada: R$ 1.234,56 ou 'R$ 0,00' se vazio
   */
  transform(value: number | string | null | undefined): string {
    // 1. Tratamento para valores nulos ou vazios
    if (value === null || value === undefined || value === '') {
      return 'R$ 0,00';
    }

    // 2. Converte para número caso venha como string do banco/API
    const amount = typeof value === 'string' ? parseFloat(value) : value;

    // 3. Verifica se a conversão resultou em um número válido (NaN check)
    if (isNaN(amount)) {
      return 'R$ 0,00';
    }

    // 4. Usa a API nativa de internacionalização (Perfeito para Cuiabá/Brasil)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}