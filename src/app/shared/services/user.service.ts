import { Injectable } from '@angular/core';
import { profiles } from '../models/profiles';

@Injectable({
  providedIn: 'root', 
})
export class UserService {
  private user: any; 
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
      }
    }
  }

  getUsers(): any[] {
    return profiles;
  }

  getUser(): any {
    console.log('getUser called:', this.user);
    return this.user;
  }

  setUser(newUser: any): void {
    this.user = newUser;
    localStorage.setItem('userHandle', newUser.handle);
    localStorage.setItem('isLoggedIn', 'true');
  }

  createUser(user: any): void {
    profiles.push(user);
  }

  checkLoginStatus(): boolean {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return this.isLoggedIn;
  }
}