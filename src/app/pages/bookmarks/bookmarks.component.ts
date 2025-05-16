import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
    private router: Router,
    private titleService: Title,
  ) { }
  title: string = 'Y / Bookmarks';

  items = tweetItems;
  bookmarks: tweetItem[] = [];
  user: any;
  tweet: any;
  ngOnInit(): void {
    // console.log('bookmarks.component.ts')
    this.titleService.setTitle(this.title);
    this.loadProfileData();
    this.loadUserData();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUserData();
      });
    //console.log(this.bookmarks);
  }

  loadProfileData() {
    if(!this.userService.checkLoginStatus()) {
      this.user = null; // Set user to null if not logged in
    }
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        // console.log('User data:', user);
        // console.log('this.user:', this.user);

      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    })
  }


  loadUserData(): void {
    this.bookmarks = this.user.bookmarks
      .map((id: string) => this.items.find((tweet: tweetItem) => tweet.id === id))
      .filter((tweet: tweetItem | undefined): tweet is tweetItem => !!tweet);
  }

  navigateToPost(tweet: tweetItem): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }

}
