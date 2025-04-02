import { Injectable } from '@angular/core';
import { profiles } from '../models/profiles';

@Injectable({
  providedIn: 'root', 
})
export class UserService {
  private user: any; 

  getUsers(): any[] {
    return profiles;
  }

  getUser(): any {
    return this.user;
  }

  setUser(newUser: any): void {
    this.user = newUser;
  }

  createUser(user: any): void {
    profiles.push(user);
  }
}