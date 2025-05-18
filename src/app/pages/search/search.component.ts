import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { TweetService } from '../../shared/services/tweet.service';
import { Subscription } from 'rxjs';
import { DocumentReference, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-search',
  imports: [
    TweetComponentShared,
    CommonModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private tweetService: TweetService,
  ) { }
  query: string | null = null;
  user: any;
  tweets: tweetItem[] = tweetItems; // Initialize tweets with the imported tweetItems array
  results: tweetItem[] = []; // Initialize results with an empty array
  title: string = 'Y / Search';

  routeSub: Subscription | null = null;

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.user = this.userService.getUser();
    this.query = this.route.snapshot.paramMap.get('query');
    if (!this.query) {
      this.results = [];
      return;
    }
    this.search();
    
  }

  onSearch(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value.trim(); 
    if (event.key === 'Enter' && input) { 
      this.router.navigate(['/search', input]); 
    }
  }

  async search(): Promise<void> {
      this.routeSub = this.route.paramMap.subscribe((params) => {
      this.query = params.get('query');
      if(!this.query) {
        this.results = [];
        return;
      }
      Promise.all([
        this.tweetService.getTweetsByUserHandle(this.query),
        this.tweetService.getTweetsByContent(this.query)
      ]).then(([handleTweets, contentTweets]) => {
        
        const allTweets = [...handleTweets, ...contentTweets];
        const uniqueTweets = allTweets.filter(
          (tweet, index, self) =>
        index === self.findIndex(t => t.id === tweet.id)
        );
        this.results = uniqueTweets;
      });
    });
  }

  clearSearchInput(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = ''; 
    }
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


  deleteTweet(tweet: tweetItem): void {
    this.results = this.results.filter(item => item.id !== tweet.id);
  }

  ngOnDestroy(): void{
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}

