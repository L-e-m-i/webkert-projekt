import { Injectable } from '@angular/core';
import { tweetItem, tweetItems } from '../models/tweetItem';
import { UserService } from './user.service';
import { profiles } from '../models/profiles';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  
  user: any;

  constructor(private userService: UserService) {
    this.userService.user$.subscribe(user => {
      this.user = user;
      console.log('TweetService updated with user:', this.user);
    });
    //this.user = this.userService.getUser(); // Get the user from UserService
    console.log('TweetService initialized with user:', this.user);
  }
  private tweets: tweetItem[] = tweetItems;

  getTweets(): tweetItem[] {
    return this.tweets;
  }

  addTweet(tweet: tweetItem): void {
    this.tweets.push(tweet);
  }

  toggleLike(tweet: tweetItem): void {
    tweet.isLiked = this.user.likes.includes(tweet.id) ? false : true;
    console.log(tweet.isLiked);
    if (tweet.isLiked) {
      tweet.likes++;
      if (!this.user.likes.includes(tweet.id)) {
        this.user.likes.push(tweet.id);
      }
      console.log(this.user,this.user.likes);
    } else {
      tweet.likes--;
      this.user.likes = this.user.likes.filter((id: number) => id !== tweet.id);
    }
  }

  toggleBookmark(tweet: tweetItem): void {
    tweet.isBookmarked = this.user.bookmarks.includes(tweet.id) ? false : true;
    if(tweet.isBookmarked){
      tweet.bookmarks++;
      if (!this.user.bookmarks.includes(tweet.id)) {
        this.user.bookmarks.push(tweet.id);
      }
    }
    else{
      tweet.bookmarks--;
      this.user.bookmarks = this.user.bookmarks.filter((id: number) => id !== tweet.id);
    }
  }

  toggleRetweet(tweet: tweetItem): void {
    tweet.isRetweeted = this.user.retweets.includes(tweet.id) ? false : true;
    if(tweet.isRetweeted){
      tweet.retweets++;
    }
    else{
      tweet.retweets--;
    }
  }

  getReplies(tweetId: number): tweetItem[] {
    const replies = this.tweets.filter((item: tweetItem) => item.parentId === tweetId);
    //console.log(`Replies for tweet ${tweetId}:`,replies);
    return replies;
  }

}
