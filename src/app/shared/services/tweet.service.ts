import { Injectable } from '@angular/core';
import { tweetItem } from '../models/tweetItem';
import { profiles } from '../models/profiles';

@Injectable({
  providedIn: 'root'
})
export class TweetService {
  profiles = profiles;
  user: any = profiles[0];
  constructor() { }

  toggleLike(tweet: tweetItem): void {
    tweet.liked = !tweet.liked;
    if (tweet.liked) {
      tweet.likes++;
      this.user.likes.push(tweet.id);
      console.log(this.user.likes);
    } else {
      tweet.likes--;
      this.user.likes = this.user.likes.filter((id: number) => id !== tweet.id);
    }
  }

  toggleBookmark(tweet: tweetItem): void {
    tweet.bookmarked = !tweet.bookmarked;
    if(tweet.bookmarked){
      tweet.bookmarks++;
    }
    else{
      tweet.bookmarks--;
    }
  }

  toggleRetweet(tweet: tweetItem): void {
    tweet.retweeted = !tweet.retweeted;
    if(tweet.retweeted){
      tweet.retweets++;
    }
    else{
      tweet.retweets--;
    }
  }

}
