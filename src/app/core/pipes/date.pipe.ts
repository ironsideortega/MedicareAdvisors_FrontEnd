import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    if (typeof value === 'string') {
      // Si el valor es una cadena, conviértela a Date
      value = new Date(value);
    }

    // Obtiene los componentes de la fecha
    const day = value.getDate();
    const month = value.getMonth() + 1;
    const year = value.getFullYear();

    // Formatea la fecha en formato "dd/mm/yyyy"
    const formattedDate = `${this.padZero(day)}/${this.padZero(month)}/${year}`;

    return formattedDate;
  }

  private padZero(num: number): string {
    // Agrega un cero delante si el número es menor que 10
    return num < 10 ? '0' + num : num.toString();
  }
}
