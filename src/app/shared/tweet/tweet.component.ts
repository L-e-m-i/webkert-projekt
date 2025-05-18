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

import { DocumentReference, Firestore,collection, doc, getDoc } from '@angular/fire/firestore';
import { HandleifyPipe } from '../pipes/handlify.pipe';


@Component({
  selector: 'app-tweet-shared',
  imports: [
    MatIcon,
    DateFormatterPipe,
    HandleifyPipe,
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
  @Output() deleteTweetEvent = new EventEmitter<tweetItem>();


  static openedTweetId: string | null = null;
  parent!: tweetItem;
  constructor(
    private tweetService: TweetService,
    private userService: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private firestore: Firestore,
  ) {}

  likes: string[] = [];
  bookmarks: string[] = [];
  replies: tweetItem[] = [];
  hasReplies: boolean = false;
  isLiked: boolean = false;
  isBookmarked: boolean = false;

  user: any;
  
  isLoading: boolean = true;  

  

  tweetSub: Subscription | null = null;
  userSub: Subscription | null = null;
  routeSub: Subscription | null = null;

  ngOnInit(): void {

    const tweetId = this.tweet.id;
    this.tweetService.getTweetOwner(tweetId).then((owner) => {
      this.tweet = { ...this.tweet, owner };
      // console.log('tweet', this.tweet);
    }).catch((error) => {
      console.error('Error fetching tweet owner:', error);
    });

    
    

    this.userSub = this.userService.getUserProfile().pipe(take(1)).subscribe((user) => {
      this.user = user;
      
      this.likes = this.user.likes ? this.user.likes.map((like: any) => like.id) : [];
 
      this.bookmarks = this.user.bookmarks ? this.user.bookmarks.map((bookmark: any) => bookmark.id) : [];

      this.isBookmarked = this.bookmarks.includes(this.tweet.id);
      this.isLiked = this.likes.includes(this.tweet.id);
      
      this.getReplies(this.tweet.id);
      if (this.tweet.inReplyTo) {
        const inReplyTo = this.tweet.inReplyTo as unknown as DocumentReference | undefined;
        if (!inReplyTo) {
          console.error('No inReplyTo field found for tweet:', this.tweet);
          return;
        }
      

      
      if (typeof inReplyTo !== 'object' || typeof (inReplyTo as DocumentReference).id !== 'string') {
        console.error('inReplyTo is not a valid DocumentReference:', inReplyTo);
        return;
      }


        getDoc(inReplyTo).then((parentDocSnap) => {
          
          this.tweetService.getTweetById(parentDocSnap.id).then((tweet) => {
            this.parent = tweet;

          });
        });
      }
      this.isLoading = false;
    });
    if (!this.tweet || typeof this.tweet.id !== 'string') {
      console.error('Invalid tweet object passed to TweetComponentShared:', this.tweet);
      return;
    }

    
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
    // console.log('user', this.user);
    
    if(this.user.id === null){
      this.router.navigate(['login']);
      return;
    }
    // console.log('tweet', tweet);
    
    this.userService.toggleLike(tweet.id).then(() => {
      // console.log('likes', this.likes);
      
      if(this.likes.includes(tweet.id)){
        this.likes = this.likes.filter((t) => t !== tweet.id);
        if (typeof tweet.likes === 'number') {
          tweet.likes--;
        }
      }else{
        this.likes.push(tweet.id);
        if (typeof tweet.likes === 'number') {
          tweet.likes++;
        }
      }

      this.cdr.detectChanges()
      // this.tweetService.toggleLike(tweet);
      this.likeChange.emit();
    }).finally(() => {
      this.isLiked = !this.isLiked
    })
       
  }



  async bookmarkTweet(tweet: tweetItem): Promise<void> {
    if(this.user.id === null){
      this.router.navigate(['login']);
      return;
    }
    this.userService.toggleBookmark(tweet.id).then(() => {
      if(this.bookmarks.includes(tweet.id)){
        this.bookmarks = this.bookmarks.filter((t) => t !== tweet.id);
        if (typeof tweet.bookmarks === 'number') {
          tweet.bookmarks--;
        }
      }else{
        this.bookmarks.push(tweet.id);
        if (typeof tweet.bookmarks === 'number') {
          tweet.bookmarks++;
        }
      }
      this.cdr.detectChanges()
      this.bookmarkChange.emit();
    }).finally(() => {
      this.isBookmarked = !this.isBookmarked
      
    })


    // this.tweetService.toggleBookmark(tweet);
  }

  async deleteTweet(tweet: tweetItem): Promise<void> {
    this.tweetService.deleteTweet(tweet.id).then(() => {
      this.deleteTweetEvent.emit(tweet); 
      
    }).catch((error) => {
      console.error('Error deleting tweet:', error);
    });
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