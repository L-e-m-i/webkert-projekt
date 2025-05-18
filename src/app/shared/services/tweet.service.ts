import { Injectable } from '@angular/core';
import { tweetItem, tweetItems } from '../models/tweetItem';
import { UserService } from './user.service';
import { Firestore, getDocs, getDoc, where, collection, query, doc, deleteDoc  } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';
import { filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TweetService {
  
  user: any;

  constructor(
    private userService: UserService,
    private firestore: Firestore
  ) {
    this.userService.user$
    .pipe(filter(user => !!user))
    .subscribe(user => {
      this.user = user;

    });
    //this.user = this.userService.getUser(); // Get the user from UserService

  }
  private tweets: tweetItem[] = tweetItems;

  getTweets(): Observable<tweetItem[]> {
    const tweetCollection = collection(this.firestore, 'Tweets')
    return collectionData(tweetCollection, { idField: 'id' }).pipe(
      map((tweets: any[]) => tweets as tweetItem[])
    );
  }

  async getTweetsByUserHandle(handle: string): Promise<tweetItem[]> {
    const tweetCollection = collection(this.firestore, 'Tweets');
    const tweetsSnapshot = await getDocs(tweetCollection);
    const tweets = tweetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as tweetItem[];
    const userTweets = tweets.filter(tweet => tweet.handle === handle);
    return userTweets;
  }

  async getTweetById(tweetId: string): Promise<tweetItem> {
    
    
    const tweetCollection = collection(this.firestore, 'Tweets');
    const tweetRef = doc(tweetCollection, tweetId);
    const tweetSnapshot = await getDoc(tweetRef);
    const tweet = { id: tweetSnapshot.id, ...tweetSnapshot.data() } as tweetItem;
    return tweet;
  }

  async getTweetsByContent(query: string): Promise<tweetItem[]> {
    const tweetCollection = collection(this.firestore, 'Tweets');
    return getDocs(tweetCollection).then((tweetsSnapshot) => {
      const tweets = tweetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as tweetItem[];
      const filteredTweets = tweets.filter(tweet => tweet.content.toLowerCase().includes(query.toLowerCase()));

      
      return filteredTweets;
    });
  }

  addTweet(tweet: tweetItem): void {
    this.tweets.push(tweet);
  }

  toggleLike(tweet: tweetItem): void {
    var isLiked: boolean = false;
    
    isLiked = this.user.likes.includes(tweet.id) ? false : true;

    if (isLiked) {

      if (!this.user.likes.includes(tweet.id)) {
        this.user.likes.push(tweet.id);
      }

    } else {
      // tweet.likes--;
      // this.user.likes = this.user.likes.filter((id: number) => id !== tweet.id);
    }
  }

  toggleBookmark(tweet: tweetItem): void {
    var isBookmarked: boolean = false;
    
    isBookmarked = this.user.bookmarks.includes(tweet.id) ? false : true;

    if (isBookmarked) {
      // tweet.likes++;
      if (!this.user.bookmarks.includes(tweet.id)) {
        this.user.bookmarks.push(tweet.id);
      }

    } else {
      // tweet.likes--;
      // this.user.likes = this.user.likes.filter((id: number) => id !== tweet.id);
    }
  }

  toggleRetweet(tweet: tweetItem): void {
    // tweet.isRetweeted = this.user.retweets.includes(tweet.id) ? false : true;
    // if(tweet.isRetweeted){
    //   tweet.retweets++;
    //   if (!this.user.retweets.includes(tweet.id)) {
    //     this.user.retweets.push(tweet.id);
    //   }
    // }
    // else{
    //   // tweet.retweets--;
    //   this.user.retweets = this.user.retweets.filter((id: number) => id !== tweet.id)
    // }
  }

  async deleteTweet(tweetId: string): Promise<void> {
    const tweetCollection = collection(this.firestore, 'Tweets');
    const tweetRef = doc(tweetCollection, tweetId);
    console.log('tweet deleted', tweetRef);
    
    await deleteDoc(tweetRef);
  }

  async getReplies(tweetId: string): Promise<tweetItem[]> {
    const tweetCollection = collection(this.firestore, 'Tweets');
    const tweetRef = doc(this.firestore, 'Tweets', tweetId);
    const replyQuery = query(tweetCollection, where('inReplyTo', '==', tweetRef));
    const tweetsSnapshot = await getDocs(replyQuery);
    const replies = tweetsSnapshot.docs.map(doc => ({ 
      id: doc.id, ...doc.data() 
    })) as tweetItem[]; 
    
    
    return replies;
  }

}
