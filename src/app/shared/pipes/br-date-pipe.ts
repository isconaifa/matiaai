import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brDate',
  standalone: true
})
export class BrDatePipe implements PipeTransform {

  transform(value: string | Date | null): string {
    if (!value) return '';

    let date: Date;

    if (typeof value === 'string') {
      // Se a string vier apenas YYYY-MM-DD, o JS assume UTC.
      // Adicionamos 'T12:00:00' para garantir que, mesmo subtraindo 4h (Cuiabá), 
      // continue sendo o mesmo dia.
      if (value.length === 10) {
        date = new Date(value + 'T12:00:00');
      } else {
        date = new Date(value);
      }
    } else {
      date = value;
    }
    // Usamos o Intl.DateTimeFormat forçando o fuso horário de Cuiabá
    // Isso garante que o formato seja brasileiro e o cálculo de horas respeite o -4
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'America/Cuiaba' // <--- O segredo para nós aqui do MT
    }).format(date);
  }
}