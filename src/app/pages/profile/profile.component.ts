import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart, NavigationError, NavigationCancel, Event as RouterEvent } from '@angular/router';
import { Profile } from '../../shared/models/profiles';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { TweetService } from '../../shared/services/tweet.service';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../shared/services/user.service';
import { filter, distinctUntilChanged, take } from 'rxjs/operators';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Firestore, query, Timestamp, where, collection, doc, getDocs, getDoc, DocumentReference } from '@angular/fire/firestore';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Component as DialogComponent, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HandleifyPipe } from '../../shared/pipes/handlify.pipe';



@Component({
  selector: 'app-profile',
  imports: [
    MatTabGroup,
    MatTabsModule,
    CommonModule,
    TweetComponentShared,
    HandleifyPipe,
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
    private dialog: MatDialog // Inject MatDialog here
  ) { }
  
  private currentUserSub: Subscription | null = null;
  private userSub: Subscription | null = null;
  private routeSub: Subscription | null = null;
  isLoading: boolean = true;
  items: tweetItem[] = [];
  likes: any[] = [];
  user!: Profile;


  handle!: string | null; 
  currentUser: any; // Current user object
  title: string = '';

  ngOnInit(): void {
    
    
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const handle = params.get('handle');
      this.loadProfileData(handle); // Reload profile data when handle changes
      
    });
    this.title = `Y / `;
    this.titleService.setTitle(this.title);
  
  }

  

  loadProfileData(handle: string | null): void {
    this.currentUserSub = this.userService.getUserProfile().pipe(take(1)).subscribe((user) => {
      this.currentUser = user;

      
    })
    if(!handle){
      console.error('No handle provided in the route.');
      return;
    }
    this.userSub = this.userService.getUserProfileByHandle(handle).subscribe({
      next: (data) =>{
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
          
          
        }
        this.isLoading = false;
      }
    })
    
  }



  trackById(index: number, tweet: tweetItem): string {
    return tweet.id;
  }


  navigateToPost(tweet: tweetItem): void {
    if(tweet.inReplyTo){
      this.navigateToReply(tweet);
      return;
    }
    this.router.navigate([tweet.handle, tweet.id]);
  }

  async navigateToReply(tweet: tweetItem): Promise<void> {  
    //const tweetCollection = collection(this.firestore, 'Tweets');

 

    // Check if inReplyTo is a DocumentReference
    const inReplyTo = tweet.inReplyTo as DocumentReference | undefined;
    if (!inReplyTo) {
      console.error('No inReplyTo field found for tweet:', tweet);
      return;
    }

    // Type guard: check if inReplyTo is a DocumentReference
    if (typeof inReplyTo !== 'object' || typeof (inReplyTo as DocumentReference).id !== 'string') {
      console.error('inReplyTo is not a valid DocumentReference:', inReplyTo);
      return;
    }

    const parentDocSnap = await getDoc(inReplyTo as DocumentReference);
    if (!parentDocSnap.exists()) {
      console.error('Parent tweet not found:', inReplyTo);
      return;
    }
    const parent = { id: parentDocSnap.id, ...parentDocSnap.data() } as tweetItem;



    if (parent) {
      this.router.navigate([parent.handle, parent.id]);
    } else {
      console.error('Parent tweet not found:', tweet.inReplyTo);
    }
  }

  async followAccount(): Promise<void> {
    if(this.user && this.currentUser && this.user.id !== this.currentUser.id) {
      this.userService.toggleFollow(this.user.id, this.currentUser.id).then(() => {
        this.loadProfileData(this.handle);
      })
      
    }
    
    
  }

  isFollowing(): boolean {
    
    if (this.user && this.currentUser) {
      return this.user.followers?.includes(this.currentUser.id) ?? false;
    }
    return false;
  }

  likeTweet(tweetId: string): void {
    if (this.currentUser) {
      this.userService.toggleLike(tweetId);
      
    }
  }
  openEditProfile(): void {
    this.router.navigate(['edit-profile']);
  }



  openFollowersDialog(): void {
    if (!this.user?.followers?.length) {
      this.dialog.open(FollowListDialogComponent, {
        data: { title: 'Followers', users: [] }
      });
      return;
    }

    this.dialog.open(FollowListDialogComponent, {
      data: { title: 'Followers', users: this.user.followers }
    });
  }

  openFollowingDialog(): void {
    if (!this.user?.following?.length) {
      this.dialog.open(FollowListDialogComponent, {
        data: { title: 'Following', users: [] }
      });
      return;
    }
    

    this.dialog.open(FollowListDialogComponent, {
      data: { title: 'Following', users: this.user.following }
    });

   
  }



  ngOnDestroy(): void {
    if (this.currentUserSub) {
      this.currentUserSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}




// Dialog component for displaying followers/following
@DialogComponent({
  selector: 'app-follow-list-dialog',
  imports: [
    MatDialogModule,
    CommonModule,
    HandleifyPipe
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <ng-container *ngIf="users?.length; else empty">
        <div *ngFor="let user of users" class="follow-user" (click)='navigateToUser(user.handle)'>
         
          <div>
            <img [src]="user.profilePicture ? user.profilePicture : 
            '../../../assets/img/pfp/default.png'" alt="{{ user.username }}" width="50" height="50" class='pfp'>
          </div>
          <div class='user-info'>
            <div>{{ user.username }}</div>
            <div>{{ user.handle | handleify}}</div>
          </div>
        </div>
      </ng-container>
      <ng-template #empty>
        <p>No users found.</p>
      </ng-template>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [`

    .follow-user {
      border-radius: 10px;

      border: 1px solid #ccc;
      padding: 10px;
      display: flex;
      align-items: center;
      flex-direction: row;
      gap: 10px;
      margin: 5px 0;
      cursor: pointer;
    }
    .user-info { 
      padding: 8px 0; 
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      
    }
    .pfp{
      border-radius: 50%;
      width: 50px;
      height: 50px;
    }

  `]
})
export class FollowListDialogComponent {
  users: Profile[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string, users: string[] },
    public dialog: MatDialog,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {

    this.data.users.forEach((user) => {
      this.userService.getUserProfileById(user).pipe(take(1)).subscribe({
        next: (userData) => {
          if (userData.user) {
            this.users.push(userData.user);
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
    })
  }
  
  navigateToUser(userHandle: string): void {
    this.dialog.closeAll();
    this.router.navigate(['profile', userHandle]);
  }

  ngOnDestroy(): void {

  }
}
