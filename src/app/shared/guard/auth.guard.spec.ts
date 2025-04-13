import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { UserService } from '../services/user.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['checkLoginStatus']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authGuard = TestBed.inject(AuthGuard);
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow activation if user is logged in', () => {
    userServiceSpy.checkLoginStatus.and.returnValue(true);

    const result = authGuard.canActivate();

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should block activation and redirect if user is not logged in', () => {
    userServiceSpy.checkLoginStatus.and.returnValue(false);

    const result = authGuard.canActivate();

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});