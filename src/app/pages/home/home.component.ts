import { Component } from '@angular/core';
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


@Component({
  selector: 'app-home',
  imports: [
    //MatIcon,
    //DateFormatterPipe,
    TweetComponentShared,
    CommonModule,
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
  ) { }  

  user: any; 
  items: tweetItem[] = []
  private tweetSub!: Subscription;
  private userSub!: Subscription;


  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.loadProfileData();

    this.tweetSub = this.tweetService.getTweets().subscribe((tweets: tweetItem[]) => {
      this.items = tweets;
      this.items.sort((a, b) => new Timestamp(Number(a.timestamp), 0).toMillis() - new Timestamp(Number(b.timestamp), 0).toMillis());
    });
    
  }

  loadProfileData() {
    if(!this.userService.checkLoginStatus()) {
      this.user = null; // Set user to null if not logged in
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
