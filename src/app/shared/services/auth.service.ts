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

import { BehaviorSubject, Observable } from 'rxjs';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Profile as User } from '../models/profiles';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: Observable<FirebaseUser | null>;
  private userSubject = new BehaviorSubject<FirebaseUser | null>(null);
  user$ = this.userSubject.asObservable();
  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) { 
    this.currentUser = authState(this.auth);
  }

  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const userId = userCredential.user.uid;

      // Emit the authenticated user
      this.userSubject.next(userCredential.user);

      // Navigate to home after successful login
      this.router.navigate(['/home']);
      return userCredential;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, userData: Partial<User>): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Create user data in Firestore
      await this.createUserData(userCredential.user.uid, {
        ...userData,
        id: userCredential.user.uid,
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
    
      // Emit the authenticated user
      this.userSubject.next(userCredential.user);
    
      // Navigate to home after successful signup
      this.router.navigate(['/home']);
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

  async signOut() : Promise<void>{
    try {
      await signOut(this.auth);

      // Emit null to indicate the user has signed out
      this.userSubject.next(null);

      // Navigate to login page
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  isLoggedIn(): Observable<FirebaseUser | null> {
    return this.currentUser;
  }

  updateLoginStatus(status: boolean) {
    localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
  }

  async deleteUser(userId: string): Promise<void>{
    const userRef = doc(collection(this.firestore, 'Users'), userId);
    await setDoc(userRef, {
      isDeleted: true
    }, { merge: true });
    await this.auth.currentUser?.delete();
  }
}
