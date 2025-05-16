import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart, NavigationError, NavigationCancel, Event as RouterEvent } from '@angular/router';
import { Profile, profiles } from '../../shared/models/profiles';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { TweetService } from '../../shared/services/tweet.service';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../shared/services/user.service';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Firestore, query, Timestamp, where, collection, doc, getDocs } from '@angular/fire/firestore';



@Component({
  selector: 'app-profile',
  imports: [
    MatTabGroup,
    MatTabsModule,
    CommonModule,
    TweetComponentShared,
    MatIconModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  
})
export class ProfileComponent {
  constructor(
    private tweetService: TweetService,
    private userService: UserService, 
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private firestore: Firestore,
  ) { }
  
  private subscribtion: Subscription | null = null;
  isLoading: boolean = true;
  items: tweetItem[] = [];
  likes: any[] = [];
  user!: Profile;


  handle!: string | null; 
  currentUser: any; // Current user object
  title: string = '';

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe((user) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
    })
    
   
   
   

    this.route.paramMap.subscribe((params) => {
      const handle = params.get('handle');
      this.loadProfileData(handle); // Reload profile data when handle changes
      
    });
    this.title = `Y / `;
    this.titleService.setTitle(this.title);
  
  }

  

  loadProfileData(handle: string | null): void {
    if(!handle){
      console.error('No handle provided in the route.');
      return;
    }
    this.subscribtion = this.userService.getUserProfileByHandle(handle).subscribe({
      next: (data) =>{
        console.log('data:', data);
        if(!data){
          console.error('No data found for handle:', handle);
          return;
        }
        if(data){
          this.user = data.user ?? {} as Profile;
          this.handle = data.user ? data.user.handle : null;
          this.likes = (data.likes ?? [])
          
          
          
          this.items = data.tweets as tweetItem[];
          this.items.sort((a, b) => new Timestamp(Number(a.timestamp), 0).toMillis() - new Timestamp(Number(b.timestamp), 0).toMillis());
          
          console.log('Profile user:', this.user);
          
        }
        this.isLoading = false;
      }
    })
    // if (!handle) {
      // console.error('No handle provided in the route.');
      // return;
    // }
    // const user = this.userService.getUserByHandle(handle);
    // if (!user) {
      // console.error('User not found for handle:', handle);
      // return;
    // }
    // this.user = user;
    // this.likes = this.user.likes
      // .map((id: number) => this.items.find((tweet: tweetItem) => tweet.id === id))
      // .filter((tweet: tweetItem | undefined): tweet is tweetItem => !!tweet);
  }



  trackById(index: number, tweet: tweetItem): string {
    return tweet.id;
  }


  navigateToPost(tweet: tweetItem): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }

  async navigateToReply(tweet: tweetItem): Promise<void> {
    const tweetCollection = collection(this.firestore, 'Tweets');
    const tweetRef = doc(tweetCollection, tweet.id);
    const parentQuery = query(tweetCollection, where('id', '==', tweetRef.id));
    const parentSnapshot = await getDocs(parentQuery);
    const parent = parentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0] as tweetItem;
  
    
    if (parent) {
      this.router.navigate([parent.handle, parent.id]);
    } else {
      console.error('Parent tweet not found:', tweet.inReplyTo);
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
      return this.user.followers?.includes(this.currentUser.id) ?? false;
    }
    return false;
  }

  likeTweet(tweetId: string): void {
    if (this.currentUser) {
      this.userService.toggleLike(tweetId);
      //console.log('Liked tweet:', tweetId);
    }
  }



  openEditProfile(): void {
    this.router.navigate(['edit-profile']);
  }
}
