import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { UserService } from '../services/user.service';

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



  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    //console.log("constructor called");
  }

  ngOnInit(): void {

    //this.userHandle = localStorage.getItem('userHandle');
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.isLoggedIn = this.userService.checkLoginStatus();
        this.userHandle = localStorage.getItem('userHandle');
      }
    });
    //console.log("ngOnInit called");
  }

  ngAfterViewInit(): void {
    //console.log("ngAfterViewInait called");
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
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userHandle');
    this.isLoggedIn = false;
    window.location.href = '/home';
  }
}
