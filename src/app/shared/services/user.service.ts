import { Injectable } from '@angular/core';
import { profiles } from '../models/profiles';

@Injectable({
  providedIn: 'root', 
})
export class UserService {
  private user = profiles[0]; 

  getUser(): any {
    return this.user;
  }

  setUser(newUser: any): void {
    this.user = newUser;
  }
}