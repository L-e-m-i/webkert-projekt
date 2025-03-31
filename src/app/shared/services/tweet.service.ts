import { Injectable } from '@angular/core';
import { tweetItem } from '../models/tweetItem';


@Injectable({
  providedIn: 'root'
})
export class TweetService {

  constructor() { }

  toggleLike(tweet: tweetItem): void {
    tweet.liked = !tweet.liked;
    if (tweet.liked) {
      tweet.likes++;
    } else {
      tweet.likes--;
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
