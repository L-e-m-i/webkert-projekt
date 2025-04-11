import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      handle:['', [Validators.required, Validators.minLength(3)]],
      password:['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login(): void{
    if (this.loginForm.valid) {
      const { handle, password } = this.loginForm.value;   
      for(let i = 0; i < this.userService.getUsers().length; i++){
        if(this.userService.getUsers()[i].handle == handle && this.userService.getUsers()[i].password == password){
          console.log('User found:', this.userService.getUsers()[i]);
          this.userService.setUser(this.userService.getUsers()[i]);
          this.loginForm.reset();
          this.router.navigate(['/home']);
          break;
        }
      }
    } else {
      console.error('Form is invalid');
    }
  }

}
