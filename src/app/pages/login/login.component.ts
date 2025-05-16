import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';

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
  title: string = 'Y / Login';

  authSubscription?: Subscription;
  constructor(
    private fb: FormBuilder, 
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private authService: AuthService,
  ){}

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.minLength(3)]],
      password:['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login(): void{
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;   
      this.authService.signIn(email, password).then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // console.log('User logged in:', user);
        this.authService.updateLoginStatus(true);
        this.router.navigate(['/home']);
      }).catch((error) => {
        switch (error.code) {
          case 'auth/user-not-found':
            console.error('User not found');
            break;
          case 'auth/wrong-password':
            console.error('Wrong password');
            break;
          default:
            console.error('Login failed:', error.message);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
