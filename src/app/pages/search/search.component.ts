import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  constructor(private userService: UserService) { }

  user: any;
  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

}
