import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'handleify'
})
export class HandleifyPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return '@' + value;
  }

}
