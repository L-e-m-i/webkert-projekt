import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { profiles } from '../models/profiles';

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

  createUser(user: any): void {
    profiles.push(user);
  }

  checkLoginStatus(): boolean {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return this.isLoggedIn;
  }
}