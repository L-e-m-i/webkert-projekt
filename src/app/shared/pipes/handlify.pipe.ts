import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'handleify'
})
export class HandleifyPipe implements PipeTransform {

  transform(value: string | undefined, ...args: unknown[]): unknown {
    if (!value) {
      return null;
    }
    return '@' + value;
  }

}
