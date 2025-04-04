import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { tweetItem } from './shared/models/tweetItem';

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
  
  selectedTabIndex: number = 0;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private userService: UserService
  ) {}

  user: any;
  ngOnInit(): void {
    this.userService.checkLoginStatus() ? this.user = this.userService.getUser() : this.user = null;
   
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
    const routes = ['/home', '/search', '/messages', `/profile/${localStorage.getItem('userHandle')}`];
    if (routes[index]) {
      this.router.navigate([routes[index]]);
    }
  }

  updateSelectedTab(url: string): void {
    //console.log('URL:', url);
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
