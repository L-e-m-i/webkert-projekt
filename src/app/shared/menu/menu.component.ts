import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';


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


  userHandle: string | null = null;



  constructor() {
    console.log("constructor called");
  }

  ngOnInit(): void {
    this.userHandle = localStorage.getItem('userHandle');
    console.log("ngOnInit called");
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInait called");
  }

  isScreenSmall(): boolean {
    return this.isSmallScreen;
  }

  closeMenu(): void {
    if (this.isScreenSmall() && this.sidenav) {
      this.sidenav.close();
    }
  }
}
