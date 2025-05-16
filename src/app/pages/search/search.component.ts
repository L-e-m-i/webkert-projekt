import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

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
  ) { }
  query: string | null = null;
  user: any;
  tweets: tweetItem[] = tweetItems; // Initialize tweets with the imported tweetItems array
  results: tweetItem[] = []; // Initialize results with an empty array
  title: string = 'Y / Search';


  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.user = this.userService.getUser();
    this.query = this.route.snapshot.paramMap.get('query');
    if (!this.query) {
      this.results = [];
      return;
    }
    this.route.paramMap.subscribe((params) => {
      this.query = params.get('query');
      this.results = this.tweets.filter((tweet) => {
        const handle = tweet.handle.toLowerCase();
        const content = tweet.content.toLowerCase();
        const query = this.query?.toLowerCase() || '';
        return handle.includes(query) || content.includes(query);
      });
    });
    
  }

  onSearch(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value.trim(); 
    if (event.key === 'Enter' && input) { 
      this.router.navigate(['/search', input]); 
    }
  }

  clearSearchInput(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = ''; 
    }
  }

  navigateToPost(tweet: tweetItem): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }
}
