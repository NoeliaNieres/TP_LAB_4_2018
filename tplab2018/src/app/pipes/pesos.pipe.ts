import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pesos'
})
export class PesosPipe implements PipeTransform {

  transform(value: any): string {
    return '$' + value + ' (arg)';
  }
}
