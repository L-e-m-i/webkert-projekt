import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  UserCredential,
  User as FirebaseUser,
  signOut,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';

import { Observable } from 'rxjs';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Profile as User } from '../models/profiles';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: Observable<FirebaseUser | null>;
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) { 
    this.currentUser = authState(this.auth);
  }

  signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async signUp(email: string, password: string, userData: Partial<User>): Promise<UserCredential> {
    try {
      // Use createUserWithEmailAndPassword for signing up a new user
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
  
      // Create user data in Firestore
      await this.createUserData(userCredential.user.uid, {
        ...userData,
        id: userCredential.user.uid, // Ensure the ID is set correctly
        email: email,
        bannerPicture: '',
        profilePicture: '',
        bio: '',
        tweets: [],
        followers: [],
        following: [],
        likes: [],
        retweets: [],
        replies: [],
        bookmarks: [],

      });
  
      return userCredential;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  private async createUserData(uid: string, userData: Partial<User>) {
    const userRef = doc(collection(this.firestore, 'Users'), uid);

    return setDoc(userRef, userData);
  }

  signOut() : Promise<void>{
    localStorage.setItem('isLoggedIn', 'false');
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn(): Observable<FirebaseUser | null> {
    return this.currentUser;
  }

  updateLoginStatus(status: boolean) {
    localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
  }
}
