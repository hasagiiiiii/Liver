import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyVND',
  standalone: true
})
export class CurrencyVNDPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '0 ₫';
    const num = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[^\d.-]/g, ''));
    if (isNaN(num)) return '0 ₫';
    return `${num.toLocaleString('vi-VN')} ₫`;
  }
}
