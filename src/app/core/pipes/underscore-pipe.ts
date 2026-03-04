import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'underscore',
})
export class UnderscorePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return value.split("_").join(" ");
  }

}
