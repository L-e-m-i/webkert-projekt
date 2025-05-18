import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Profile } from '../models/profiles';
import { Subscription } from 'rxjs';

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

  userSub: Subscription | null = null;
  routeSub: Subscription | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
  ) {
    
  }

  ngOnInit(): void {
    this.loadProfileData().then(() => {
      
    }).catch((error) => {
      console.error('Error loading profile data:', error);
    });
    this.updateSidenavDisableClose();

    window.addEventListener('resize', () => {
      this.updateSidenavDisableClose();
    });
    //this.userHandle = localStorage.getItem('userHandle');
    this.routeSub = this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.loadProfileData();
        
        this.isLoggedIn = this.userService.checkLoginStatus();
               
        
        this.userHandle = this.user?.handle ?? null;        
      }
    });
    
  }

  ngAfterViewInit(): void {
    
  }

  updateSidenavDisableClose(): void {
    if (this.sidenav) {
      this.sidenav.disableClose = !this.isSmallScreen;
    }
  }

  async loadProfileData() {
    if(!this.userService.checkLoginStatus()) {
      this.user = null; // Set user to null if not logged in
    }
    this.userSub = this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user.user;
        this.userHandle = user.user?.handle ?? null;
        
        

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

      this.authService.updateLoginStatus(false);
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Logout failed:', error.message);
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
