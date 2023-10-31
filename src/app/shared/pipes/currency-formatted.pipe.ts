import { Pipe, PipeTransform, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
    name: 'currencyFormatted',
    standalone: true
})
export class CurrencyFormattedPipe extends CurrencyPipe implements PipeTransform {
  override transform(value: any): any {
    // Using 'undefined' will take the default value of CurrencyPipe
    return super.transform(value, undefined, undefined, '0.0-0');
  }
}
