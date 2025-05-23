import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { tweetItem } from './shared/models/tweetItem';
import { CommonModule } from '@angular/common';
import { MenuComponent } from "./shared/menu/menu.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserService } from './shared/services/user.service';
import { filter, take } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuComponent,
    MatToolbarModule,
    MatIconModule,
    MatSidenav,
    MatSidenavModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    //RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;

  isLoggedIn: boolean = false;
  title = 'Y';
  page: string = 'home';
  isSmallScreen: boolean = false;
  isSearchRoute: boolean = false;
  selectedTabIndex: number = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private userService: UserService,
    private firestore: Firestore,
  ) {}

  user: any;
  ngOnInit(): void {
    
    
    this.loadProfileData();
    
    //localStorage.setItem('userHandle', 'johndoe');
    this.breakpointObserver.observe(['(max-width: 500px)']).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        
        //this.updateScreenSize();
        this.updateSelectedTab(event.urlAfterRedirects);
        this.isLoggedIn = this.userService.checkLoginStatus();
        if (!event.urlAfterRedirects.startsWith('/search')) {
          this.clearSearchInput();
        }
      }
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isSearchRoute = event.urlAfterRedirects.includes('/search');
      });
  }

  loadProfileData() {
    if(!this.userService.checkLoginStatus()) {
      this.user = null; // Set user to null if not logged in
    }
    this.userService.getUserProfile().pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;


      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    })
  }

  /*updateScreenSize() {
    this.isSmallScreen = this.breakpointObserver.isMatched(['(max-width: 500px)']);
  }*/

  changePage(page: string) {
    this.page = page;
  }
  
  onSidenavToggle(sidenav: MatSidenav) {
    if(this.isSmallScreen) {
      sidenav.toggle();
    }
  }

  onTabChange(index: number): void {
    let routes: string[] = ['/home', '/search', '/messages', '/profile'];
    if(!this.userService.checkLoginStatus()){
      routes = ['/home', '/search', '/login', '/login'];
    }
    if (index === 3) { // Profile tab
      const currentHandle = this.router.url.split('/profile/')[1]; // Extract the current profile handle from the URL
      const handle = currentHandle ; // Use the current handle if available, otherwise fallback to logged-in user's handle
      
      this.userService.checkLoginStatus() ? 
        this.router.navigate([`${routes[index]}/${handle}`]) : 
        this.router.navigate(['/login']);

    } else if (routes[index]) {
      this.router.navigate([routes[index]]);
    }
  }

  updateSelectedTab(url: string): void {
    
    const routes = ['/home', '/search', '/messages', '/profile'];
    const index = routes.findIndex(route => 
      route === '/profile' ? url.startsWith('/profile') : route === url
    );
    if (index !== -1) {
      this.selectedTabIndex = index;
    }
  }


  

  onSearch(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value.trim(); 
    if (event.key === 'Enter' && input) { 
      this.router.navigate(['/search', input]); 
    }
  }

  clearSearchInput(): void {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = ''; 
    }
  }

  

  
}
