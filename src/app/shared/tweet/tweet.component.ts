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


  static openedTweetId: string | null = null;

  constructor(
    private tweetService: TweetService,
    private userService: UserService,
    private router: Router,
  ) {}

  items: tweetItem[] = [];
  likes: tweetItem[] = [];
  replies: tweetItem[] = [];
  user: any;
  hasReplies: boolean = false;

  ngOnInit(): void {
    if (!this.tweet || typeof this.tweet.id !== 'string') {
      console.error('Invalid tweet object passed to TweetComponentShared:', this.tweet);
      return;
    }
    console.log('tweetcomponens',this.tweet);
    
    this.tweetService.getTweets().subscribe((tweets: tweetItem[]) => {
      this.items = tweets;
      // console.log('tweets',tweets);
      // console.log('Tweet',this.tweet);
      // console.log('items',this.items);  
      
      this.user = this.userService.getUser();
      // console.log(this.tweet.isLiked)
      //this.loadUserData();
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
        
          this.loadUserData();
      });
    });
    
  }


  loadUserData(): void {
    if(!this.user|| !this.user.likes) {
      this.likes = [];
      return;
    };
    this.likes = this.user.likes
      .map((id: string) => this.items.find((tweet: tweetItem) => tweet.id === id))
      .filter((tweet: tweetItem | undefined): tweet is tweetItem => !!tweet);
  }

  getReplies(tweetId: string): void {
    this.tweetService.getReplies(tweetId).then((replies) => {
      this.replies = replies;
      this.hasReplies = this.replies.length > 0;
    })
  }

  likeTweet(tweet: tweetItem): void {
    this.userService.toggleLike(tweet.id);
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
    TweetComponentShared.openedTweetId = tweet.id;
    //console.log(`navigateToPost: openedTweetId set to ${this.openedTweetId} opened: ${this.isOpened(tweet.id)}`);
    this.tweetClick.emit(tweet); // Emit the event for further actions
  }

  navigateToProfile(handle: string){
    this.router.navigate(['profile/', handle])
  }

  isReply(tweet: any): boolean {
    return tweet.parentId !== undefined && tweet.parentId !== null;
  }

  isOpened(tweetId: string): boolean{
    //const isOpen = this.openedTweetId === tweetId;
    //console.log(`isOpened called for tweetId: ${tweetId}, result: ${isOpen}`);
    return TweetComponentShared.openedTweetId == tweetId;
  }
}