import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { profiles } from '../models/profiles';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root', 
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(null); // Observable for user changes
  user$ = this.userSubject.asObservable(); // Expose the observable
  private user: any = null;
  private isLoggedIn: boolean = false;


  constructor() {
    this.loadUserFromLocalStorage();
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
    console.log('getUsers called:', profiles);
    return profiles;
  }

  getUser(): any {
    // console.trace('getUser called:', this.user); // Debugging
    //console.log('getUser called:', this.user);
    return this.user;
  }

  getUserById(id: number): any {
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
    console.log('User created:', user);
    return of({success: true});
  }

  checkLoginStatus(): boolean {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return this.isLoggedIn;
  }

  toggleFollow(userId: number, followerId: number): void {
    const user = this.getUserById(userId);
    const follower = this.getUserById(followerId);
    if (user && follower) {
      if (user.followers.includes(followerId)) {
        user.followers = user.followers.filter((id: number) => id !== followerId);
        follower.following = follower.following.filter((id: number) => id !== userId);
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

}