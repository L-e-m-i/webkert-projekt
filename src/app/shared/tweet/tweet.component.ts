import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { TweetService } from '../../shared/services/tweet.service';
import { UserService } from '../../shared/services/user.service';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { Subscription } from 'rxjs';


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
    private cdr: ChangeDetectorRef,
  ) {}

  likes: string[] = [];
  bookmarks: string[] = [];
  replies: tweetItem[] = [];
  user: any;
  hasReplies: boolean = false;

  isLiked: boolean = false;
  isBookmarked: boolean = false;

  tweetSub: Subscription | null = null;
  userSub: Subscription | null = null;
  routeSub: Subscription | null = null;

  ngOnInit(): void {
    this.userSub = this.userService.getUserProfile().pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.likes = this.user.likes ? this.user.likes.map((like: any) => like.id) : [];
      this.bookmarks = this.user.bookmarks ? this.user.bookmarks.map((bookmark: any) => bookmark.id) : [];
      this.isLiked = this.likes.includes(this.tweet.id);
    });
    if (!this.tweet || typeof this.tweet.id !== 'string') {
      console.error('Invalid tweet object passed to TweetComponentShared:', this.tweet);
      return;
    }
    console.log('tweetcomponens',this.tweet);
    
    
  }


  loadUserData(): void {
    this.userSub = this.userService.getUserProfile().pipe(take(1)).subscribe((user) => {
      this.user = user;
      
    });
  }

  getReplies(tweetId: string): void {
    this.tweetService.getReplies(tweetId).then((replies) => {
      this.replies = replies;
      this.hasReplies = this.replies.length > 0;
    })
  }

  async likeTweet(tweet: tweetItem): Promise<void> {
    
    this.userService.toggleLike(tweet.id).then(() => {
      
      if(this.likes.includes(tweet.id)){
        this.likes = this.likes.filter((t) => t !== tweet.id);
     
      }else{
        this.likes.push(tweet.id);
      }

      this.cdr.detectChanges()
      // this.tweetService.toggleLike(tweet);
      this.likeChange.emit();
    }).finally(() => {
      this.isLiked = !this.isLiked
    })
    
    

    
  }



  bookmarkTweet(tweet: tweetItem): void {

    this.userService.toggleBookmark(tweet.id).then(() => {
      if(this.bookmarks.includes(tweet.id)){
        this.bookmarks = this.bookmarks.filter((t) => t !== tweet.id);
      }else{
        this.bookmarks.push(tweet.id);
      }
      this.cdr.detectChanges()
      this.bookmarkChange.emit();
    }).finally(() => {
      this.isBookmarked = !this.isBookmarked
      
    })


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
    
    return TweetComponentShared.openedTweetId == tweetId;
  }

  ngOnDestroy(): void{
    if (this.tweetSub) {
      this.tweetSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}