import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'id',
})
export class IdPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.slice(0, 10);
  }

}
