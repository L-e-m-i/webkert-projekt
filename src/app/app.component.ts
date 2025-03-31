import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { tweetItem } from './shared/models/tweetItem';
import { profiles } from './shared/models/profiles';
import { MenuComponent } from "./shared/menu/menu.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';


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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  title = 'Y';
  page: string = 'home';
  isSmallScreen: boolean = false;
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateScreenSize();
      }
    });
  }


  updateScreenSize() {
    this.isSmallScreen = this.breakpointObserver.isMatched(['(max-width: 768px)']);
  }

  changePage(page: string) {
    this.page = page;
  }
  
  onSidenavToggle(sidenav: MatSidenav) {
    if(this.isSmallScreen) {
      sidenav.toggle();
    }
  }

  onTabChange(index: number): void {
    const routes = ['/home', '/search', '/messages', '/profile'];
    if (routes[index]) {
      this.router.navigate([routes[index]]);
    }
  }

  onSearch(event: Event){
    
  }
  
}
