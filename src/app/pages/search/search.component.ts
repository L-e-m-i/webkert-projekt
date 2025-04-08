import { Component } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { CommonModule } from '@angular/common';


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
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  query: string | null = null;
  user: any;
  tweets: tweetItem[] = tweetItems; // Initialize tweets with the imported tweetItems array
  results: tweetItem[] = []; // Initialize results with an empty array

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.query = this.route.snapshot.paramMap.get('query');
    this.route.paramMap.subscribe((params) => {
      this.query = params.get('query');
      this.results = this.tweets.filter((tweet) => {
        const handle = tweet.handle.toLowerCase();
        const content = tweet.content.toLowerCase();
        const query = this.query?.toLowerCase() || '';
        return handle.includes(query) || content.includes(query);
      });
    });
    //console.log('ngOnInit search', this.query);
  }



  navigateToPost(tweet: tweetItem): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }
}
