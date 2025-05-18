import { Component, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { ActivatedRoute, Params } from '@angular/router';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { TweetService } from '../../shared/services/tweet.service';
import { Router } from '@angular/router';

import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Title } from '@angular/platform-browser';
import { collection, doc, Firestore, getDocs, query, Timestamp, where } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'


@Component({
  selector: 'app-tweet',
  imports: [
    CommonModule,
    TweetComponentShared,
    MatFormFieldModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tweet.component.html',
  styleUrl: './tweet.component.scss'
})
export class TweetComponent {
  @ViewChild(TweetComponentShared) tweetShared!: TweetComponentShared;

  tweet!: tweetItem;
  handle!: string; // User handle from route
  id!: string; // Tweet ID from route
  reply = new FormControl('');
  replies: tweetItem[] = [];

  tweetSub!: Subscription;
  routeSub!: Subscription;

  isLoading: boolean = true; 


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tweetService: TweetService,
    private userService: UserService,
    private titleService: Title,
    private firestore: Firestore,
  ) {}

  items: tweetItem[] = [];
  title = ''; // Title for the page
  ngOnInit(): void {
    this.tweetSub = this.tweetService.getTweets().subscribe((tweets: tweetItem[]) => {
      this.items = tweets;
      
      
    });
    
    this.routeSub = this.route.params.subscribe((params: Params) => {
      
      this.handle = params['handle'];
      this.id = params['postId'];
      this.tweetService.getTweetById(this.id).then((tweet) => {
        this.tweet = tweet;
        this.isLoading = false;
      });
      this.getReplies(this.id);
    });

    this.title = `Y / Tweet by ${this.handle}`; // Set the title based on the user handle
    this.titleService.setTitle(this.title);
    
    
    
  }

  isReply(tweet: any): boolean {
    return tweet.parentId !== undefined && tweet.parentId !== null;
  }

  navigateToPost(tweet: any): void {

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


  getReplies(tweetId: string): void {
    this.tweetService.getReplies(tweetId).then((replies) => {
      this.replies = replies;
      this.replies.sort((a, b) => new Timestamp(Number(a.timestamp), 0).toMillis() - new Timestamp(Number(b.timestamp), 0).toMillis());
      
    });
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; 
    if (textarea.scrollHeight < 300) {
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }else{
      textarea.style.height = '300px';
    }
  }

  async postReply(): Promise<void> {
    if (!this.reply.value?.trim()) {

      return;
    }
    let replyValue = this.reply.value.trim();
    replyValue = this.reply.value.replace(/\n/g, '<br>');
    
    await this.userService.postTweet(replyValue, this.id);
    this.getReplies(this.id);

    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto'; 
    }
    this.reply.reset();
  }

  isLoggedIn(): boolean {
    return this.userService.checkLoginStatus();
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }



  trackById(index: number, tweet: tweetItem): string {
    return tweet.id;
  }


  ngOnDestroy(): void {
    if (this.tweetSub) {
      this.tweetSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
