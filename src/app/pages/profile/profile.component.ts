import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { profiles } from '../../shared/models/profiles';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { MatIcon } from '@angular/material/icon';
import { TweetService } from '../../shared/services/tweet.service';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../shared/services/user.service';
import { filter } from 'rxjs/operators';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';


@Component({
  selector: 'app-profile',
  imports: [
    MatTabGroup,
    MatTabsModule,
    CommonModule,
    TweetComponentShared,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  
})
export class ProfileComponent {
  constructor(
    private tweetService: TweetService,
    private userService: UserService, 
    private router: Router) { }
  
  /*items: tweetItem[] = [
    new tweetItem(1, 'WHO UP JORKING THEY PEANITS RN?', 'johndoe', 'peanitsjorker', '2025-01-01T12:34:56', 69, 12, 420, 666),
    new tweetItem(2, 'in the clurb straight up jorking it', 'user2', 'user2', '2025-01-02T23:04:01', 69, 23, 420, 666),
    new tweetItem(3, 'jorking it in the clurb', 'johndoe', 'peanitsjorker', '2025-03-28T13:05:01', 69, 34, 420, 666),
    new tweetItem(4, 'Go woke go Jork', 'user4', 'user4', '2025-03-28T15:35:01', 69, 34, 420, 666),
  
  ];
*/
  items = tweetItems;
  likes: tweetItem[] = [];
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
  }

  loadUserData(): void {
    this.likes = this.user.likes
      .map((id: number) => this.items.find((tweet: tweetItem) => tweet.id === id))
      .filter((tweet: tweetItem | undefined): tweet is tweetItem => !!tweet);
  }


  trackById(index: number, tweet: tweetItem): number {
    return tweet.id;
  }

}
