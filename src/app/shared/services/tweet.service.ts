import { Injectable } from '@angular/core';
import { tweetItem, tweetItems } from '../models/tweetItem';
import { profiles } from '../models/profiles';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  profiles = profiles;
  user: any = profiles[0];
  constructor() { }
  private tweets: tweetItem[] = tweetItems;

  getTweets(): tweetItem[] {
    return this.tweets;
  }

  addTweet(tweet: tweetItem): void {
    this.tweets.push(tweet);
  }

  toggleLike(tweet: tweetItem): void {
    tweet.isLiked = !tweet.isLiked;
    if (tweet.isLiked) {
      tweet.likes++;
      this.user.likes.push(tweet.id);
      //console.log(this.user.likes);
    } else {
      tweet.likes--;
      this.user.likes = this.user.likes.filter((id: number) => id !== tweet.id);
    }
  }

  toggleBookmark(tweet: tweetItem): void {
    tweet.isBookmarked = !tweet.isBookmarked;
    if(tweet.isBookmarked){
      tweet.bookmarks++;
      this.user.bookmarks.push(tweet.id);
    }
    else{
      tweet.bookmarks--;
      this.user.bookmarks = this.user.bookmarks.filter((id: number) => id !== tweet.id);
    }
  }

  toggleRetweet(tweet: tweetItem): void {
    tweet.isRetweeted = !tweet.isRetweeted;
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
