import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart, NavigationError, NavigationCancel, Event as RouterEvent } from '@angular/router';
import { Profile, profiles } from '../../shared/models/profiles';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { MatIcon } from '@angular/material/icon';
import { TweetService } from '../../shared/services/tweet.service';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../shared/services/user.service';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  imports: [
    MatTabGroup,
    MatTabsModule,
    CommonModule,
    TweetComponentShared,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  
})
export class ProfileComponent {
  constructor(
    //private tweetService: TweetService,
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
  ) { }
  
  /*items: tweetItem[] = [
    new tweetItem(1, 'WHO UP JORKING THEY PEANITS RN?', 'johndoe', 'peanitsjorker', '2025-01-01T12:34:56', 69, 12, 420, 666),
    new tweetItem(2, 'in the clurb straight up jorking it', 'user2', 'user2', '2025-01-02T23:04:01', 69, 23, 420, 666),
    new tweetItem(3, 'jorking it in the clurb', 'johndoe', 'peanitsjorker', '2025-03-28T13:05:01', 69, 34, 420, 666),
    new tweetItem(4, 'Go woke go Jork', 'user4', 'user4', '2025-03-28T15:35:01', 69, 34, 420, 666),
  
  ];
*/
  items = tweetItems;
  likes: tweetItem[] = [];
  user: any;
  tweet: any;
  handle!: string | null; 
  currentUser: any; // Current user object
  title: string = ''
  ngOnInit(): void {
    this.currentUser = this.userService.getUser(); 
    //console.log('ngoninit prifile',this.route.snapshot.paramMap.get('handle'));
    
    //const handle = this.route.snapshot.paramMap.get('handle');
    // Use the handle to load the correct profile data
    this.route.paramMap.subscribe((params) => {
      const handle = params.get('handle');
      console.log('Profile handle changed:', handle);
      this.loadProfileData(handle); // Reload profile data when handle changes
    });
    this.title = `Y / ${this.user.handle}`;
    this.titleService.setTitle(this.title);
    /*this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        console.log('NavigationStart:', event.url);
        console.trace(event.navigationTrigger);
        
      } else if (event instanceof NavigationEnd) {
        console.log('NavigationEnd:', event.url);
      } else if (event instanceof NavigationError) {
        console.error('NavigationError:', event.error);
      } else if (event instanceof NavigationCancel) {
        console.warn('NavigationCancel:', event.url);
      }
    });*/
  }

  loadProfileData(handle: string | null): void {
    if (!handle) {
      console.error('No handle provided in the route.');
      return;
    }
    const user = this.userService.getUserByHandle(handle);
    if (!user) {
      console.error('User not found for handle:', handle);
      return;
    }
    this.user = user;
    this.likes = this.user.likes
      .map((id: number) => this.items.find((tweet: tweetItem) => tweet.id === id))
      .filter((tweet: tweetItem | undefined): tweet is tweetItem => !!tweet);
  }



  trackById(index: number, tweet: tweetItem): number {
    return tweet.id;
  }


  navigateToPost(tweet: tweetItem): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }

  navigateToReply(tweet: tweetItem): void {
    const parent = this.items.find((t: tweetItem) => t.id === tweet.parentId);
    if (parent) {
      this.router.navigate([parent.handle, parent.id]);
    } else {
      console.error('Parent tweet not found:', tweet.parentId);
    }
  }

  followAccount(): void {
    if(this.user && this.currentUser && this.user.id !== this.currentUser.id) {
      this.userService.toggleFollow(this.user.id, this.currentUser.id);
      //console.log('Following user:', this.user.username);

    }
    //console.log(this.user.followers);
    
  }

  isFollowing(): boolean {
    //console.log('isFollowing called:', this.user, this.currentUser);
    if (this.user && this.currentUser) {
      return this.user.followers.includes(this.currentUser.id);
    }
    return false;
  }




}
