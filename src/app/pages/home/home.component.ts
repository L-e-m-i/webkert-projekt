import { Component } from '@angular/core';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { MatIcon } from '@angular/material/icon';
import { TweetService } from '../../shared/services/tweet.service';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { UserService } from '../../shared/services/user.service';

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
  constructor(private tweetService: TweetService, private userService: UserService) { }  

  user: any; 

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  items = tweetItems;

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
