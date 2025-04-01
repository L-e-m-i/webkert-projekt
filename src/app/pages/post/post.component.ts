import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatFormFieldControl } from '@angular/material/form-field';
import { UserService } from '../../shared/services/user.service';
import { MatInput } from '@angular/material/input';
@Component({
  selector: 'app-post',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatButton,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  constructor(private userService: UserService) { }
  user: any; 

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }



}
