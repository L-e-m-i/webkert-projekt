import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TweetService } from '../../shared/services/tweet.service';
import { UserService } from '../../shared/services/user.service';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';

@Component({
  selector: 'app-tweet-shared',
  imports: [
    MatIcon,
    DateFormatterPipe,
  ],
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
})
export class TweetComponentShared {
  @Input() tweet!: tweetItem;
  @Output() likeChange = new EventEmitter<void>();
  @Output() tweetClick = new EventEmitter<tweetItem>();



  constructor(
    private tweetService: TweetService,
    private userService: UserService,
    private router: Router
  ) {}

  items = tweetItems;
  likes: tweetItem[] = [];
  user: any;
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

  likeTweet(tweet: tweetItem): void {
    this.tweetService.toggleLike(tweet);
    this.likeChange.emit();

  }

  bookmarkTweet(tweet: tweetItem): void {
    this.tweetService.toggleBookmark(tweet);
  }

  retweetTweet(tweet: tweetItem): void {
    this.tweetService.toggleRetweet(tweet);
  }

  navigateToPost(tweet: tweetItem): void {
    this.tweetClick.emit(this.tweet);
  }

}