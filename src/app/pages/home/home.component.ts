import { Component } from '@angular/core';
import { tweetItem } from '../../shared/models/tweetItem';
import { MatIcon } from '@angular/material/icon';
import { TweetService } from '../../shared/services/tweet.service';
import { DateFormatterPipe } from '../../shared/date.pipe';

@Component({
  selector: 'app-home',
  imports: [
    MatIcon,
    DateFormatterPipe
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(private tweetService: TweetService) { }  

  items: tweetItem[] = [
    new tweetItem(1, 'WHO UP JORKING THEY PEANITS RN?', 'peanitsjorker', 'user1', '2025-01-01T12:34:56', 69, 12, 420, 666),
    new tweetItem(2, 'in the clurb straight up jorking it', 'user2', 'user2', '2025-01-02T23:04:01', 69, 23, 420, 666),
    new tweetItem(3, 'jorking it in the clurb', 'user3', 'user3', '2025-03-28T13:05:01', 69, 34, 420, 666),
    new tweetItem(4, 'Go woke go Jork', 'user4', 'user4', '2025-03-28T15:35:01', 69, 34, 420, 666),
  
  ];

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
