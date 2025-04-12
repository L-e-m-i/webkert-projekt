import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate{
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.userService.checkLoginStatus(); // Check if the user is logged in
    if (!isLoggedIn) {
      this.router.navigate(['/login']); // Redirect to login if not authenticated
      return false;
    }
    return true;
  }
};
