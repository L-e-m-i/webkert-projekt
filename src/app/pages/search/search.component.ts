import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  user: any;
  ngOnInit(): void {
    this.user = this.userService.getUser();
  }



  navigateToPost(tweet: tweetItem): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }
}
