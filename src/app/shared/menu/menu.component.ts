import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Profile } from '../models/profiles';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,

  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, AfterViewInit {
  @Input() sidenav!: MatSidenav;
  @Input() isSmallScreen!: boolean;
  
  isLoggedIn: boolean = false;
  userHandle: string | null = null;

  user: Profile | null = null; // User object to hold the profile data

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
  ) {
    //console.log("constructor called");
  }

  ngOnInit(): void {
    this.loadProfileData().then(() => {
      // console.log('Profile data loaded successfully');
    }).catch((error) => {
      console.error('Error loading profile data:', error);
    });

    //this.userHandle = localStorage.getItem('userHandle');
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.loadProfileData();
        // console.log("NavigationEnd event detected");
        this.isLoggedIn = this.userService.checkLoginStatus();
        // console.log('user.menu.ts:', this.user);
        
        
        this.userHandle = this.user?.handle ?? null;
        // console.log("userHandle:", this.userHandle);
        
      }
    });
    //console.log("ngOnInit called");
  }

  ngAfterViewInit(): void {
    //console.log("ngAfterViewInait called");
  }

  async loadProfileData() {
    if(!this.userService.checkLoginStatus()) {
      this.user = null; // Set user to null if not logged in
    }
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user.user;
        this.userHandle = user.user?.handle ?? null;
        // console.log('User data menu:', user);
        // console.log('this.user:', this.user);

      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    })
  }

  isScreenSmall(): boolean {
    return this.isSmallScreen;
  }

  closeMenu(): void {
    if (this.isScreenSmall() && this.sidenav) {
      this.sidenav.close();
    }
  }


  logout(): void {
    this.authService.signOut().then(() => {
      console.log('User logged out');
      this.authService.updateLoginStatus(false);
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Logout failed:', error.message);
    });
  }
}
