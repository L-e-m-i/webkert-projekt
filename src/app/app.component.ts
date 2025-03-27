import { Component, OnInit } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { tweetItem } from '../shared/models/tweetItem';
import { MenuComponent } from "./shared/menu/menu.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuComponent,
    MatToolbarModule,
    MatIconModule,
    MatSidenav,
    MatSidenavModule,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {

  items: tweetItem[] = [
    new tweetItem(1, 'Tweet 1', 'User 1', '2025-01-01', 69, 420, 666),
    new tweetItem(2, 'Tweet 2', 'User 2', '2025-01-02', 69, 420, 666)
  ];
  title = 'Y';
  page: string = 'home';
  isSmallScreen: boolean = false;
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Observe screen size changes
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  
    // Update `isSmallScreen` on route changes
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

  
}
