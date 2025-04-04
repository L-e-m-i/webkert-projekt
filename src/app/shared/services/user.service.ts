import { Injectable } from '@angular/core';
import { profiles } from '../models/profiles';

@Injectable({
  providedIn: 'root', 
})
export class UserService {
  private user: any; 
  private isLoggedIn: boolean = false;


  getUsers(): any[] {
    return profiles;
  }

  getUser(): any {
    console.log('getUser called:', this.user);
    return this.user;
  }

  setUser(newUser: any): void {
    this.user = newUser;
  }

  createUser(user: any): void {
    profiles.push(user);
  }

  checkLoginStatus(): boolean {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return this.isLoggedIn;
  }
}