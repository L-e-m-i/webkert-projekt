import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';


@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  constructor(private userService: UserService) { }

  user: any; 

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

}
