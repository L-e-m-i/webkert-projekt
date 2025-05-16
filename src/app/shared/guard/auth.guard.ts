import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }
      
      console.log('Access denied - Not authenticated');
      router.navigate(['/login']);
      return false;
    })
  );
};
