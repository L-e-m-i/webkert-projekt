import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { filter, take } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DocumentReference, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-bookmarks',
  imports: [
    CommonModule,
    TweetComponentShared,
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.scss'
})
export class BookmarksComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private titleService: Title,
  ) { }
  title: string = 'Y / Bookmarks';

  items = tweetItems;
  bookmarks: tweetItem[] = [];
  user: any;
  tweet: any;
  ngOnInit(): void {
    
    this.titleService.setTitle(this.title);


    this.loadProfileData();
    

    
  }

  loadProfileData() {
    if(!this.userService.checkLoginStatus()) {
      this.user = null; // Set user to null if not logged in
    }
    this.userService.getUserProfile().pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
        this.bookmarks = this.user.bookmarks

      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    })
  }


  loadUserData(): void {
    this.bookmarks = this.user.bookmarks
      .map((id: string) => this.items.find((tweet: tweetItem) => tweet.id === id))
      .filter((tweet: tweetItem | undefined): tweet is tweetItem => !!tweet);
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

  navigateToPost(tweet: tweetItem): void {
    if(tweet.inReplyTo){
      this.navigateToReply(tweet);
      return;
    }
    this.router.navigate([tweet.handle, tweet.id]);
  }

  trackById(index: number, tweet: tweetItem): string {
    return tweet.id;
  }


}
