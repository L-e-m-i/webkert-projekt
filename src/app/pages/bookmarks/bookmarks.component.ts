import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-bookmarks',
  imports: [
    CommonModule,
    TweetComponentShared,
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  items = tweetItems;
  bookmarks: tweetItem[] = [];
  user: any;
  tweet: any;
  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.loadUserData();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUserData();
      });
    //console.log(this.bookmarks);
  }

  loadUserData(): void {
    this.bookmarks = this.user.bookmarks
      .map((id: number) => this.items.find((tweet: tweetItem) => tweet.id === id))
      .filter((tweet: tweetItem | undefined): tweet is tweetItem => !!tweet);
  }

  navigateToPost(tweet: tweetItem): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }

}
