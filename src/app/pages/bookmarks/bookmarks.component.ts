import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-bookmarks',
  imports: [],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent {
  constructor(private userService: UserService) { }
}
