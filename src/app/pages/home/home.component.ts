import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { MatIcon } from '@angular/material/icon';
import { TweetService } from '../../shared/services/tweet.service';
import { Router } from '@angular/router';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { UserService } from '../../shared/services/user.service';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { Title } from '@angular/platform-browser';
import { Observable, Subscription, take } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-home',
  imports: [
    //MatIcon,
    //DateFormatterPipe,
    TweetComponentShared,
    CommonModule,
    InfiniteScrollDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title: string = 'Y / Home';
  constructor(
    private tweetService: TweetService,
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private cdr: ChangeDetectorRef
  ) { }  

  user: any; 
  items: tweetItem[] = []
  nonReplyTweets: tweetItem[] = [];

  private tweetSub!: Subscription;
  private userSub!: Subscription;

  tweetsPerPage: number = 10;
  currentPage: number = 1;
  visibleTweets: tweetItem[] = [];

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.loadProfileData();

    this.tweetSub = this.tweetService.getTweets().subscribe((tweets: tweetItem[]) => {
      this.items = tweets;
      this.items.sort((a, b) => new Timestamp(Number(b.timestamp), 0).toMillis() - new Timestamp(Number(a.timestamp), 0).toMillis());
      this.nonReplyTweets = this.items.filter(tweet => !tweet.inReplyTo);
      this.loadMoreTweets();
    });
    
  }

  loadMoreTweets(): void {
    
    
    const startIndex = (this.currentPage - 1) * this.tweetsPerPage;
    const endIndex = startIndex + this.tweetsPerPage;

    if (this.items && this.items.length > startIndex) {
      const newTweets = this.nonReplyTweets.slice(startIndex, endIndex);
      this.visibleTweets = [...this.visibleTweets, ...newTweets]; 
      this.currentPage++;
      this.cdr.detectChanges(); 
    } else {
      //console.warn('No more tweets to load.');
    }
  }

  deleteTweet(tweet: tweetItem): void {
    this.items = this.items.filter(item => item.id !== tweet.id);
    this.visibleTweets = this.visibleTweets.filter(item => item.id !== tweet.id);
  }

  loadProfileData() {
    if(!this.userService.checkLoginStatus()) {
      this.user = null; 
    }
    this.userSub = this.userService.getUserProfile().pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    })
  }

  trackById(index: number, tweet: tweetItem): string {
    return tweet.id;
  }


  navigateToPost(tweet: tweetItem): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }

  ngOnDestroy(): void {
    if (this.tweetSub) {
      this.tweetSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
