import { Component } from '@angular/core';
import { profiles } from '../../shared/models/profiles';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { MatIcon } from '@angular/material/icon';
import { TweetService } from '../../shared/services/tweet.service';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../shared/services/user.service';


@Component({
  selector: 'app-profile',
  imports: [
    MatIcon,
    DateFormatterPipe,
    MatTabGroup,
    MatTabsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  
})
export class ProfileComponent {
  constructor(private tweetService: TweetService, private userService: UserService) { }
  
  /*items: tweetItem[] = [
    new tweetItem(1, 'WHO UP JORKING THEY PEANITS RN?', 'johndoe', 'peanitsjorker', '2025-01-01T12:34:56', 69, 12, 420, 666),
    new tweetItem(2, 'in the clurb straight up jorking it', 'user2', 'user2', '2025-01-02T23:04:01', 69, 23, 420, 666),
    new tweetItem(3, 'jorking it in the clurb', 'johndoe', 'peanitsjorker', '2025-03-28T13:05:01', 69, 34, 420, 666),
    new tweetItem(4, 'Go woke go Jork', 'user4', 'user4', '2025-03-28T15:35:01', 69, 34, 420, 666),
  
  ];
*/
  items = tweetItems;

  user: any;
  ngOnInit(): void {
    this.user = this.userService.getUser(); // Access the global user
  }

  likeTweet(tweet: tweetItem): void {
    this.tweetService.toggleLike(tweet);
  }

  bookmarkTweet(tweet: tweetItem): void {
    this.tweetService.toggleBookmark(tweet);
  }

  retweetTweet(tweet: tweetItem): void {
    this.tweetService.toggleRetweet(tweet);
  }
}
