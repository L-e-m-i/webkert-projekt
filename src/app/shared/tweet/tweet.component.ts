import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
  ],
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss'],
})
export class TweetComponentShared {
  @Input() tweet!: tweetItem;
  @Output() tweetClick = new EventEmitter<tweetItem>();
  @Output() likeChange = new EventEmitter<void>();
  @Output() bookmarkChange = new EventEmitter<void>();
  @Output() retweetChange = new EventEmitter<void>();


  static openedTweetId: number | null = null;

  constructor(
    private tweetService: TweetService,
    private userService: UserService,
    private router: Router,
  ) {}

  items = tweetItems;
  likes: tweetItem[] = [];
  user: any;
  hasReplies: boolean = false;

  ngOnInit(): void {
    this.user = this.userService.getUser();
    //this.loadUserData();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUserData();
      });
  }


  loadUserData(): void {
    if(!this.user|| !this.user.likes) {
      this.likes = [];
      return;
    };
    this.likes = this.user.likes
      .map((id: number) => this.items.find((tweet: tweetItem) => tweet.id === id))
      .filter((tweet: tweetItem | undefined): tweet is tweetItem => !!tweet);
  }

  getReplies(tweetId: number): tweetItem[] {
    return this.tweetService.getReplies(tweetId);
  }

  likeTweet(tweet: tweetItem): void {
    this.tweetService.toggleLike(tweet);
    this.likeChange.emit();

  }

  bookmarkTweet(tweet: tweetItem): void {
    this.tweetService.toggleBookmark(tweet);
    this.bookmarkChange.emit();
  }

  retweetTweet(tweet: tweetItem): void {
    this.tweetService.toggleRetweet(tweet);
    this.retweetChange.emit();
  }

  navigateToPost(tweet: tweetItem): void {
    if (TweetComponentShared.openedTweetId === tweet.id) {
      return; 
    }
    TweetComponentShared.openedTweetId = tweet.id; // Update the opened tweet ID
    //console.log(`navigateToPost: openedTweetId set to ${this.openedTweetId} opened: ${this.isOpened(tweet.id)}`);
    this.tweetClick.emit(tweet); // Emit the event for further actions
  }

  isReply(tweet: any): boolean {
    return tweet.parentId !== undefined && tweet.parentId !== null;
  }

  isOpened(tweetId: number): boolean{
    //const isOpen = this.openedTweetId === tweetId;
    //console.log(`isOpened called for tweetId: ${tweetId}, result: ${isOpen}`);
    return TweetComponentShared.openedTweetId == tweetId;
  }
}