import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brDate',
  standalone: true
})
export class BrDatePipe implements PipeTransform {

  // Aceitamos undefined e null para matar o erro TS2345 de vez
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '—';
    }

    try {
      let date: Date;

      if (typeof value === 'string') {
        // Se a string não tiver informação de hora/fuso (ex: "2026-04-14")
        // trocamos o '-' por '/' para o JS não tratar como UTC e evitar o erro de "um dia a menos"
        const dateString = value.includes('T') ? value : value.replace(/-/g, '/');
        date = new Date(dateString);
      } else {
        date = value;
      }
      
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }

      // Intl.DateTimeFormat usa automaticamente o fuso do sistema (Cuiabá no seu caso)
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);

    } catch (error) {
      return '—';
    }
  }
}