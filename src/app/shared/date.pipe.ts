import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe implements PipeTransform {

  transform(value: string): string {
    if(!value){
      return '';
    }

    try{
      const date = new Date(value);
      if(isNaN(date.getTime())){
        return value;
      }

      const now = new Date();
      const diff = now.getTime() - date.getTime();
      if(diff < 1000){
        return 'Just now';
      }
      if(diff < 60000){
        return Math.floor(diff / 1000) + 's';
      }
      if(diff < 3600000){
        return Math.floor(diff / 60000) + 'm';
      }
      if(diff < 86400000){
        return Math.floor(diff / 3600000) + 'h';
      }
      if(diff < 604800000){
        return Math.floor(diff / 86400000) + 'd';
      }
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      return year == now.getFullYear() ?  `
      ${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` : `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;



    }
    catch(e){
      return value;
    }
  }

}
