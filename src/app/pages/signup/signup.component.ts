import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm!: FormGroup;
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.signupForm = this.fb.group({
      handle: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  signup(): void {
    if (this.signupForm.valid) {
      const { handle, password } = this.signupForm.value;
      console.log('Signup successful:', { handle, password });
      //this.userService.createUser(handle, password);
      localStorage.setItem('isLoggedIn', 'true');
      this.router.navigate(['/home']);
    } else {
      console.error('Form is invalid');
    }
  }
}
