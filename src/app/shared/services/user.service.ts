import { Injectable } from '@angular/core';
import { BehaviorSubject, from, switchMap, take } from 'rxjs';
import { Profile } from '../models/profiles';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { 
  collection, 
  doc, 
  Firestore, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  DocumentReference, 
  setDoc, 
  Timestamp, 
  updateDoc, 
  deleteDoc,
  arrayUnion,
  onSnapshot,
  orderBy} from '@angular/fire/firestore';
import { tweetItem } from '../models/tweetItem';
import { Message } from '../models/message';


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

    this.authService.user$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        this.getUserProfileById(firebaseUser.uid).subscribe({
          next: (userProfile) => {
            this.userSubject.next(userProfile);
            this.user = userProfile; // Update the user state
            console.log('user from user service', this.user);
          },
          error: (error) => {
            console.error('Error fetching user data:', error);
          },
        })
        
        
       

        

        
      } else {
        this.userSubject.next(null); // Clear the user state on sign-out
      }
    });
    // this.loadUserFromLocalStorage();
    // this.getUserProfile().pipe(take(1)).subscribe({
    //   next: (user) => {
    //     this.user = user;
    //     console.log('user from user service', this.user);
        
    //     this.userSubject.next(user); 
        

    //   },
    //   error: (error) => {
    //     console.error('Error fetching user data:', error);
    //   },
    // })
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

  getUserProfileById(userId: string): Observable<{
   id: string | null;
    user: Profile | null;
    tweets: tweetItem[] | null;
    replies: tweetItem[] | null;
    bookmarks: tweetItem[] | null;
    likes: tweetItem[] | null;
    followers: Profile[] | null;
    following: Profile[] | null;
  }> {
    return from(this.fetchUser(userId));
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
      // bookmarks.sort((a, b) => new Timestamp(Number(a.timestamp), 0).toMillis() - new Timestamp(Number(b.timestamp), 0).toMillis());
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

  }



 

  async getUserReference(userId: string): Promise<DocumentReference | null> {
    const userDocRef = doc(this.firestore, 'Users', userId);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      return userDocRef;
    } else {
      console.error('User not found:', userId);
      return null;
    }
  }


  async getUsers(): Promise<any[]> {
    const usersCollection = collection(this.firestore, 'Users');
    return getDocs(usersCollection).then((snapshot) => {
      const users: any[] = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    });
    

  }

  async searchUsers(searchQuery: string): Promise<any[]> {
    const usersCollection = collection(this.firestore, 'Users');
    const q = query(
      usersCollection,
      where('username_lowercase', '>=', searchQuery.toLowerCase()),
      where('username_lowercase', '<=', searchQuery.toLowerCase() + '\uf8ff')
    );

    const handleQuery = query(
      usersCollection,
      where('handle_lowercase', '>=', searchQuery.toLowerCase()),
      where('handle_lowercase', '<=', searchQuery.toLowerCase() + '\uf8ff')
    );

    const usernameSnapshot = await getDocs(q);
    const handleSnapshot = await getDocs(handleQuery);

    const combinedResults = new Map<string, any>();

    usernameSnapshot.forEach((doc) => {
      combinedResults.set(doc.id, { id: doc.id, ...doc.data() });
    });

    handleSnapshot.forEach((doc) => {
      combinedResults.set(doc.id, { id: doc.id, ...doc.data() });
    });

    return Array.from(combinedResults.values());
    return getDocs(q).then((snapshot) => {
      const users: any[] = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    });
  }

  async getUser(): Promise<any> {
    // console.trace('getUser called:', this.user); // Debugging
    
    return this.user;
  }

  getUserById(id: string): any {
    // console.trace('getUserById called:', id); // Debugging
   
  }


  getUserByHandle(handle: string): any {
    
  }

  setUser(newUser: any): void {
    this.user = newUser;
    localStorage.setItem('userHandle', newUser.handle);
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedIn = true;
    this.userSubject.next(this.user); // Notify subscribers
  }

  createUser(user: any): Observable<any> {
    

    return of({success: true});
  }

  checkLoginStatus(): boolean {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return this.isLoggedIn;
  }

  async toggleFollow(userId: string, followerId: string): Promise<void> {
    const userCollection = collection(this.firestore, 'Users');
    const userDocRef = doc(userCollection, userId);
    const followerDocRef = doc(userCollection, followerId);
    const userSnapshot = getDoc(userDocRef);
    const followerSnapshot = getDoc(followerDocRef);
    if ((await userSnapshot).exists() && (await followerSnapshot).exists()) {
      const userData = (await userSnapshot).data();
      const followerData = (await followerSnapshot).data();
      const followers = userData ? userData['followers'] || [] : [];
      const following = followerData ? followerData['following'] || [] : [];

      if (followers.includes(followerId)) {
        // Unfollow
        const updatedFollowers = followers.filter((id: string) => id !== followerId);
        await updateDoc(userDocRef, { followers: updatedFollowers });
        const updatedFollowing = following.filter((id: string) => id !== userId);
        await updateDoc(followerDocRef, { following: updatedFollowing });

        //this.deleteChatByParticipants([userDocRef, followerDocRef]).then(() => {
        //  console.log('Chat deleted');
        //})
        

      } else {
        // Follow
        followers.push(followerId);
        following.push(userId);
        await updateDoc(userDocRef, { followers: [...followers] });
        await updateDoc(followerDocRef, { following: [...following] });

        
        this.createChat([userDocRef, followerDocRef]).then((chat) => {

        })
        



      }
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

    } else {

    }
  }


  async toggleLike(tweetId: string): Promise<void>{
    // console.log(this.user);
    if(this.user.id === null){
      this.getUserProfile().pipe(take(1)).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      })
    }
    
    const usersCollection = collection(this.firestore, 'Users');
    const tweetsCollection = collection(this.firestore, 'Tweets');
    if (this.user) {
      const tweetRef = doc(tweetsCollection, tweetId)
      const userDocRef = doc(usersCollection, this.user.id);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        // console.log('tweetRef removed', tweetRef);
        
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

        } else {
          // console.log('tweetRef added ', tweetRef);
          
          // Add the tweet reference to likes
          likes.push(tweetRef);
          await updateDoc(userDocRef, { likes });

          const currentLikes = tweetData && typeof tweetData['likes'] === 'number' ? tweetData['likes'] : 0;
          await updateDoc(tweetRef, { 
            likes: currentLikes + 1
          });
          
        }
      } else {
        console.error('User document not found');
      }
    } else {
      console.error('User not found');
    }
  }

  async toggleBookmark(tweetId: string): Promise<void>{
    if(this.user.id === null){
      this.getUserProfile().pipe(take(1)).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        },
      })
    }
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
          

        } else {
          // Add the tweet reference to bookmarks
          bookmarks.push(tweetRef);
          await updateDoc(userDocRef, { bookmarks });

          const currentBookmarks = tweetData && typeof tweetData['bookmarks'] === 'number' ? tweetData['bookmarks'] : 0;
          await updateDoc(tweetRef, { 
            bookmarks: currentBookmarks + 1
          });
          

        }
      } else {
        console.error('User document not found');
      }
    } else {
      console.error('User not found');
    }
  }


  updateUserProfile(userId: string, updatedData: Partial<Profile>): Promise<void> {
    const userDocRef = doc(this.firestore, 'Users', userId);
    return setDoc(userDocRef, updatedData, { merge: true });
  }

  async deleteUser(userId: string): Promise<void> {
    const userDocRef = doc(this.firestore, 'Users', userId);
    const userSnapshot = await getDoc(userDocRef);
    if (userSnapshot.exists()) {
      const chatsRef = collection(this.firestore, 'Chats');
      this.deleteChatByParticipants([userDocRef]).then(() => {

      }
      ).catch((error) => {
        console.error('Error deleting chat:', error);
      });
      await this.authService.deleteUser(userId);
      await deleteDoc(userDocRef);

    } else {

    }
  }

  //CHAT---

  async getChatById(chatId: string): Promise<any> {
    const chatRef = doc(this.firestore, 'Chats', chatId);
    const chatDoc = await getDoc(chatRef);
    if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      const participants = await Promise.all(
        chatData['participants'].map(async (participantRef: DocumentReference) => {
          const participantDoc = await getDoc(participantRef);
          return participantDoc.exists() ? { id: participantDoc.id, ...participantDoc.data() } : null;
        })
      );
      return { id: chatDoc.id, ...chatData, participants: participants.filter((p) => p !== null) };
    } else {
      return null;
    }
  }


  async getMessagesByChatId(chatId: string): Promise<any[]> {
    const chatRef = doc(this.firestore, 'Chats', chatId);
    const chatSnapshot = await getDoc(chatRef);

    if (!chatSnapshot.exists()) {
      console.error('Chat not found:', chatId);
      return [];
    }

    const chatData = chatSnapshot.data();
    const messageRefs = chatData['messages'] || [];

    const messages = await Promise.all(
      messageRefs.map(async (messageRef: DocumentReference) => {
      const messageDoc = await getDoc(messageRef);
      return messageDoc.exists() ? { id: messageDoc.id, ...messageDoc.data() } : null;
      })
    );

    return messages.filter((message) => message !== null);
    
  }

  getMessagesByChatIdRealTime(chatId: string, callback: (messages: Message[]) => void): void {
    const messagesCollection = collection(this.firestore, 'Messages');
    const messagesQuery = query(
      messagesCollection,
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc') 
    );

    onSnapshot(messagesQuery, (querySnapshot) => {
      const messages: Message[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return new Message(
          data['id'],
          data['senderId'],
          data['timestamp'],
          data['content']
        );
      });
      callback(messages);
    });
  }



  async getChatsByUserId(userId: string): Promise<any> {
    const userDocRef = doc(this.firestore, 'Users', userId);
    const chatsRef = collection(this.firestore, 'Chats');
    const q = query(chatsRef, where('participants', 'array-contains', userDocRef), orderBy('lastMessageTime', 'desc'));
    const chatDocs = getDocs(q);
    const chatsSnapshot = await chatDocs;
    const chats = await Promise.all(
      chatsSnapshot.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data();
        const participants = await Promise.all(
          chatData['participants'].map(async (participantRef: DocumentReference) => {
            const participantDoc = await getDoc(participantRef);
            return participantDoc.exists() ? { id: participantDoc.id, ...participantDoc.data() } : null;
          })
        );
        return { id: chatDoc.id, ...chatData, participants: participants.filter((p) => p !== null) };
      })
    );
    return chats;
    
  }

  async createChat(participants: DocumentReference[]): Promise<any> {
    const chatsRef = collection(this.firestore, 'Chats');
    const chatData = {
      participants: participants,
      messages: [],
      createdAt: Timestamp.now(),
      lastMessage: null,
      lastMessageSender: null,
      lastMessageTime: Timestamp.now(),
    };

    
    const docRef = await addDoc(chatsRef, chatData);
    const chat = await getDoc(docRef);
    return chat.exists() ? { id: chat.id, ...chat.data() } : null;
  }

  async deleteChat(chatId: string): Promise<void> {
    const chatRef = doc(this.firestore, 'Chats', chatId);
    const messagesRef = collection(chatRef, 'Messages');
    const messagesSnapshot = await getDocs(messagesRef);
    const deletePromises = messagesSnapshot.docs.map(async (chatDoc) => {
      const chatRef = chatDoc.ref;
      
      
      const messagesRef = collection(this.firestore, 'Messages');
      const messagesQuery = query(messagesRef, where('chatId', '==', chatRef.id));
      const messagesSnapshot = await getDocs(messagesQuery);
      
      const messageDeletePromises = messagesSnapshot.docs.map((msgDoc) => deleteDoc(msgDoc.ref));
      await Promise.all(messageDeletePromises);
      

      return deleteDoc(chatRef);
    });
    await Promise.all(deletePromises);
  }

  async deleteChatByParticipants(participants: DocumentReference[]): Promise<void> {
    const chatsRef = collection(this.firestore, 'Chats');
    const q = query(chatsRef, where('participants', 'array-contains-any', participants));
    const querySnapshot = await getDocs(q);

    const deletePromises = querySnapshot.docs.map(async (chatDoc) => {
      const chatRef = chatDoc.ref;

      
      const messagesRef = collection(this.firestore, 'Messages');
      const messagesQuery = query(messagesRef, where('chatId', '==', chatRef.id));
      const messagesSnapshot = await getDocs(messagesQuery);

      const messageDeletePromises = messagesSnapshot.docs.map((msgDoc) => deleteDoc(msgDoc.ref));
      await Promise.all(messageDeletePromises);

      // Delete the chat document
      return deleteDoc(chatRef);
    });

  await Promise.all(deletePromises);
  }


  /*
    this.id = id;
    this.senderId = senderId;
    this.timestamp = timestamp;
    this.content = content;
  */



  async addMessageToChat(chatId: string, message: any): Promise<any> {

    
    const chatRef = doc(this.firestore, 'Chats', chatId);

    const messagesRef = collection(this.firestore, 'Messages');

    const messageData = {
      senderId: message.senderId,
      timestamp: message.timestamp,
      content: message.content,
      chatId: chatRef.id,
    };

    const docRef = await addDoc(messagesRef, messageData);
    
    await updateDoc(docRef, {
      id: docRef.id,
    })
    
    await updateDoc(chatRef, {
      lastMessage: message.content,
      lastMessageSender: message.senderId,
      lastMessageTime: Timestamp.now(),
      messages: arrayUnion(docRef),
    });
    return docRef;
  }

}