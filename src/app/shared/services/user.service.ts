import { Injectable } from '@angular/core';
import { BehaviorSubject, from, switchMap, take } from 'rxjs';
import { Profile, profiles } from '../models/profiles';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { collection, doc, Firestore, getDoc, getDocs, query, where, addDoc, DocumentReference, setDoc, Timestamp, updateDoc } from '@angular/fire/firestore';
import { tweetItem } from '../models/tweetItem';

@Injectable({
  providedIn: 'root', 
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null); // Observable for user changes
  user$: Observable<any> = this.userSubject.asObservable(); // Expose the observable
  private user: any = null;
  private isLoggedIn: boolean = false;


  constructor(
    private authService: AuthService,
    private firestore: Firestore,
  ) {
    // this.loadUserFromLocalStorage();
    this.getUserProfile().pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;
        this.userSubject.next(user); 


      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    })
  }

  getUserProfile(): Observable<{
    id: string | null;
    user: Profile | null;
    tweets: tweetItem[] | null;
    replies: tweetItem[] | null;
    bookmarks: tweetItem[] | null;
    likes: tweetItem[] | null;
    followers: Profile[] | null;
    following: Profile[] | null;
  }> {
    return this.authService.currentUser.pipe(
      switchMap(user => {
        if(!user){
          return of({
            id: null,
            user: null,
            tweets: null,
            replies: null,
            bookmarks: null,
            likes: null,
            followers: null,
            following: null,
          });
        }
        return from(this.fetchUser(user.uid));
      }
    ));
  }

  getUserProfileByHandle(handle: string): Observable<{
    id: string | null;
    user: Profile | null;
    tweets: tweetItem[] | null;
    replies: tweetItem[] | null;
    bookmarks: tweetItem[] | null;
    likes: tweetItem[] | null;
    followers: Profile[] | null;
    following: Profile[] | null;
  }> {
    return this.authService.currentUser.pipe(
      switchMap(user => {
        if(!user){
          return of({
            id: null,
            user: null,
            tweets: null,
            replies: null,
            bookmarks: null,
            likes: null,
            followers: null,
            following: null,
          });
        }
        return this.fetchUserByHandle(handle);
      }
    ));
  }

  private async fetchUser(userId: string): Promise<{
    id: string | null;
    user: Profile | null;
    tweets: tweetItem[] | null;
    replies: tweetItem[] | null;
    bookmarks: tweetItem[] | null;
    likes: tweetItem[] | null;
    followers: Profile[] | null;
    following: Profile[] | null;
  }> {
    const userDocRef = doc(this.firestore, 'Users', userId);
    const userSnapshot = await getDoc(userDocRef);

    if(!userSnapshot.exists()){
      console.error('User not found in Firestore:', userId);
      return {
        id: null,
        user: null,
        tweets: null,
        replies: null,
        bookmarks: null,
        likes: null,
        followers: null,
        following: null,
      };
    }
    const userData = userSnapshot.data() as Profile;
    
    
    


    const tweetDocsRef = collection(this.firestore, 'Tweets');
    const tweetsQuery = query(tweetDocsRef, where('userId', '==', userId));
    const tweetsSnapshot = await getDocs(tweetsQuery);
    const tweets = tweetsSnapshot.docs.map(doc => doc.data() as tweetItem);
    

    const likesReferences = userData.likes || [];
    
    
    let likes: tweetItem[] = [];
    if (likesReferences.length > 0) {
      const tweetDocsRef = collection(this.firestore, 'Tweets');
      const likesSnapshots = await Promise.all(
        likesReferences.map(async (ref: any) => {
          const tweetDoc = await getDoc(doc(tweetDocsRef, ref.id || ref));
          return tweetDoc.exists() ? tweetDoc.data() as tweetItem : null;
        })
      );
      likes = likesSnapshots.filter((tweet): tweet is tweetItem => tweet !== null);
    }


    const bookmarksReferences = userData.bookmarks || [];
    let bookmarks: tweetItem[] = [];
    if (bookmarksReferences.length > 0) {
      const tweetDocsRef = collection(this.firestore, 'Tweets');
      const bookmarksSnapshots = await Promise.all(
        bookmarksReferences.map(async (ref: any) => {
          const tweetDoc = await getDoc(doc(tweetDocsRef, ref.id || ref));
          return tweetDoc.exists() ? tweetDoc.data() as tweetItem : null;
        })
      );
      bookmarks = bookmarksSnapshots.filter((tweet): tweet is tweetItem => tweet !== null);
      bookmarks.sort((a, b) => new Timestamp(Number(a.timestamp), 0).toMillis() - new Timestamp(Number(b.timestamp), 0).toMillis());
    }


    const repliesQuery = query(
      tweetDocsRef,
      where('userId', '==', userId),
      where('inReplyTo', '!=', null)
    );
    const repliesSnapshot = await getDocs(repliesQuery);
    const replies = repliesSnapshot.docs.map(doc => doc.data() as tweetItem);
    


    const followersQuery = query(collection(this.firestore, 'Users'), where('followers', 'array-contains', userId));
    const followersSnapshot = await getDocs(followersQuery);
    const followers = followersSnapshot.docs.map(doc => doc.data() as Profile);
    

    const followingQuery = query(collection(this.firestore, 'Users'), where('following', 'array-contains', userId));
    const followingSnapshot = await getDocs(followingQuery);
    const following = followingSnapshot.docs.map(doc => doc.data() as Profile);
    



    return {
      id: userId, // Ensure the ID is set correctly
      user: userData, // Include the user data
      tweets: tweets,
      replies: replies,
      bookmarks: bookmarks, //todo
      likes: likes, 
      followers: followers,
      following: following,
    };
    
  }

  private async fetchUserByHandle(handle: string): Promise<{
    id: string | null;
    user: Profile | null;
    tweets: tweetItem[] | null;
    replies: tweetItem[] | null;
    bookmarks: tweetItem[] | null;
    likes: tweetItem[] | null; 
    followers: Profile[] | null;
    following: Profile[] | null;
  }> {
    const usersCollection = collection(this.firestore, 'Users');
    const q = query(usersCollection, where('handle', '==', handle));
    const userSnapshot = await getDocs(q);
    if(userSnapshot.empty){
      console.error('User not found in Firestore:', handle);
      return {
        id: null,
        user: null,
        tweets: null,
        replies: null,
        bookmarks: null,
        likes: null,
        followers: null,
        following: null,
      };
    }
    const userData = userSnapshot.docs[0].data() as Profile;
    const userId = userSnapshot.docs[0].id;
    
    
    const tweetDocsRef = collection(this.firestore, 'Tweets');
    const tweetsQuery = query(tweetDocsRef, where('userId', '==', userId));
    const tweetsSnapshot = await getDocs(tweetsQuery);
    const tweets = tweetsSnapshot.docs.map(doc => doc.data() as tweetItem);
    

    const repliesQuery = query(
      tweetDocsRef,
      where('userId', '==', userId),
      where('inReplyTo', '!=', null)
    );
    const repliesSnapshot = await getDocs(repliesQuery);
    const replies = repliesSnapshot.docs.map(doc => doc.data() as tweetItem);
    
    const likesReferences = userData.likes || [];
    
    
    let likes: tweetItem[] = [];
    if (likesReferences.length > 0) {
      const tweetDocsRef = collection(this.firestore, 'Tweets');
      const likesSnapshots = await Promise.all(
        likesReferences.map(async (ref: any) => {
          const tweetDoc = await getDoc(doc(tweetDocsRef, ref.id || ref));
          return tweetDoc.exists() ? tweetDoc.data() as tweetItem : null;
        })
      );
      likes = likesSnapshots.filter((tweet): tweet is tweetItem => tweet !== null);
    }


    const bookmarksReferences = userData.bookmarks || [];
    let bookmarks: tweetItem[] = [];
    if (bookmarksReferences.length > 0) {
      const tweetDocsRef = collection(this.firestore, 'Tweets');
      const bookmarksSnapshots = await Promise.all(
        bookmarksReferences.map(async (ref: any) => {
          const tweetDoc = await getDoc(doc(tweetDocsRef, ref.id || ref));
          return tweetDoc.exists() ? tweetDoc.data() as tweetItem : null;
        })
      );
      bookmarks = bookmarksSnapshots.filter((tweet): tweet is tweetItem => tweet !== null);
      bookmarks.sort((a, b) => new Timestamp(Number(a.timestamp), 0).toMillis() - new Timestamp(Number(b.timestamp), 0).toMillis());
    }
    

    const followersQuery = query(collection(this.firestore, 'Users'), where('followers', 'array-contains', userId));
    const followersSnapshot = await getDocs(followersQuery);
    const followers = followersSnapshot.docs.map(doc => doc.data() as Profile);
    

    const followingQuery = query(collection(this.firestore, 'Users'), where('following', 'array-contains', userId));
    const followingSnapshot = await getDocs(followingQuery);
    const following = followingSnapshot.docs.map(doc => doc.data() as Profile);
    



    return {
      id: userId, // Ensure the ID is set correctly
      user: userData, // Include the user data
      tweets: tweets,
      replies: replies,
      bookmarks: bookmarks, //todo
      likes: likes, //todo
      followers: followers,
      following: following,
    };
  }

  private loadUserFromLocalStorage(): void {
    const userHandle = localStorage.getItem('userHandle');
    if (userHandle) {
      const storedUser = profiles.find(profile => profile.handle === userHandle);
      if (storedUser) {
        this.user = storedUser;
        this.isLoggedIn = true;
        this.userSubject.next(this.user);
      }
    }
  }


  getUsers(): any[] {
    
    return profiles;
  }

  async getUser(): Promise<any> {
    // console.trace('getUser called:', this.user); // Debugging
    
    return this.user;
  }

  getUserById(id: string): any {
    // console.trace('getUserById called:', id); // Debugging
    const user = profiles.find((profile) => profile.id === id);
    if (!user) {
      console.error('User not found for ID:', id);
    }
    return user;
  }


  getUserByHandle(handle: string): any {
    // console.trace('getUserByHandle called:', handle); // Debugging
    const user = profiles.find((profile) => profile.handle === handle);
    if (!user) {
      console.error('User not found for handle:', handle);
    }
    return user;
  }

  setUser(newUser: any): void {
    this.user = newUser;
    localStorage.setItem('userHandle', newUser.handle);
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedIn = true;
    this.userSubject.next(this.user); // Notify subscribers
  }

  createUser(user: any): Observable<any> {
    profiles.push(user);

    return of({success: true});
  }

  checkLoginStatus(): boolean {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return this.isLoggedIn;
  }

  toggleFollow(userId: string, followerId: string): void {
    const user = this.getUserById(userId);
    const follower = this.getUserById(followerId);
    if (user && follower) {
      if (user.followers.includes(followerId)) {
        user.followers = user.followers.filter((id: string) => id !== followerId);
        follower.following = follower.following.filter((id: string) => id !== userId);
        console.log(`User ${followerId} unfollowed ${user.username}`);
      } else {
        user.followers.push(followerId);
        follower.following.push(userId);
        console.log(`User ${followerId} followed ${user.username}`);
      }
    
    } else {
      console.error('User not found for ID:', userId);
    }
  }

  addTweet(): void {
    if (this.user) {
      // this.user.tweets.push(tweetId);
      const tweetDocsRef = doc(this.firestore, 'Tweets');
      
      
    } else {
      console.error('User not found');
    }
  }


  async postTweet(content: string, parentId?: string): Promise<void> {
    if (this.user) {
      
      const tweetCollection = collection(this.firestore, 'Tweets')

      let parentIdValue: string | null;
      if (parentId) {
        parentIdValue = parentId;
      } else {
        parentIdValue = null;
      }

      const tweet = new tweetItem(
        Date.now().toString(), 
        content, [], 
        this.user.user.handle, 
        new Timestamp(Date.now() / 1000, 0), 
        this.user.user.username
      );
      const tweetObject = {
        ...tweet,
        userId: this.user.id,
      }
      
      const docRef = await addDoc(tweetCollection, tweetObject)
      const tweetId = docRef.id

      let parentRef = null;
      if (parentId) {
        parentRef = doc(this.firestore, 'Tweets', parentId);
      }
      await updateDoc(docRef, {
        inReplyTo: parentRef
      });

      await updateDoc(docRef, {
        id: tweetId
      })
      

      const tweetData = { ...tweet }; // Convert to a plain object

      if(parentId){
        const parentTweetRef = doc(this.firestore, 'Tweets', parentId);
        const parentTweetSnap = await getDoc(parentTweetRef);
        const parentTweetData = parentTweetSnap.data();
        const currentComments = parentTweetData && typeof parentTweetData['comments'] === 'number' ? parentTweetData['comments'] : 0;
        await updateDoc(parentTweetRef, {
          comments: currentComments + 1
        });
      }
      

    } else {
      console.error('User not found');
    }
  }




  addReply(tweetId: string): void {
    if (this.user) {
      this.user.replies.push(tweetId);
      console.log(`Reply ${tweetId} added to user ${this.user.handle}`);
    } else {
      console.error('User not found');
    }
  }


  async toggleLike(tweetId: string): Promise<void>{
    const usersCollection = collection(this.firestore, 'Users');
    const tweetsCollection = collection(this.firestore, 'Tweets');
    if (this.user) {
      const tweetRef = doc(tweetsCollection, tweetId)
      const userDocRef = doc(usersCollection, this.user.id);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const likes = userData['likes'] || [];
        const tweetData = (await getDoc(tweetRef)).data();
        if (likes.some((ref: DocumentReference) => ref.id === tweetId)) {
          // Remove the tweet reference from likes
          const updatedLikes = likes.filter((ref: DocumentReference) => ref.id !== tweetId);
          await updateDoc(userDocRef, { likes: updatedLikes });

           const currentLikes = tweetData && typeof tweetData['likes'] === 'number' ? tweetData['likes'] : 0;
           await updateDoc(tweetRef, { 
             likes: currentLikes > 0 ? currentLikes - 1 : 0
           });
           console.log(`Tweet ${tweetId} unliked by user ${this.user.id}`);
        } else {
          // Add the tweet reference to likes
          likes.push(tweetRef);
          await updateDoc(userDocRef, { likes });

          const currentLikes = tweetData && typeof tweetData['likes'] === 'number' ? tweetData['likes'] : 0;
          await updateDoc(tweetRef, { 
            likes: currentLikes + 1
          });
          console.log(`Tweet ${tweetId} liked by user ${this.user.id}`);
        }
      } else {
        console.error('User document not found');
      }
    } else {
      console.error('User not found');
    }
  }

  async toggleBookmark(tweetId: string): Promise<void>{
    const usersCollection = collection(this.firestore, 'Users');
    const tweetsCollection = collection(this.firestore, 'Tweets');
    if (this.user) {
      const tweetRef = doc(tweetsCollection, tweetId)
      const userDocRef = doc(usersCollection, this.user.id);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        const bookmarks = userData['bookmarks'] || [];
        const tweetData = (await getDoc(tweetRef)).data();
        if (bookmarks.some((ref: DocumentReference) => ref.id === tweetId)) {
          // Remove the tweet reference from bookmarks
          const updatedBookmarks = bookmarks.filter((ref: DocumentReference) => ref.id !== tweetId);
          await updateDoc(userDocRef, { bookmarks: updatedBookmarks });

          const currentBookmarks = tweetData && typeof tweetData['bookmarks'] === 'number' ? tweetData['bookmarks'] : 0;
          await updateDoc(tweetRef, { 
            bookmarks: currentBookmarks > 0 ? currentBookmarks - 1 : 0
          });
          
           console.log(`Tweet ${tweetId} unbookmarked by user ${this.user.id}`);
        } else {
          // Add the tweet reference to bookmarks
          bookmarks.push(tweetRef);
          await updateDoc(userDocRef, { bookmarks });

          const currentBookmarks = tweetData && typeof tweetData['bookmarks'] === 'number' ? tweetData['bookmarks'] : 0;
          await updateDoc(tweetRef, { 
            bookmarks: currentBookmarks + 1
          });
          
          console.log(`Tweet ${tweetId} bookmarked by user ${this.user.id}`);
        }
      } else {
        console.error('User document not found');
      }
    } else {
      console.error('User not found');
    }
  }

}