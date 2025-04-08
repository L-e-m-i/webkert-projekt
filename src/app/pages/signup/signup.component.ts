import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Profile } from '../../shared/models/profiles';

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
  error: string[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      handle: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  signup(): void {
    if (this.signupForm.valid) {
      const { email, handle, password, confirmPassword } = this.signupForm.value;
      if( password !== confirmPassword) {
        this.error.push('Passwords do not match');
        return;
      }
      const newUser = new Profile(Profile.profileId++, handle, handle, email, password);
      this.userService.createUser(newUser).subscribe(
        (response) => {
          console.log('User created successfully:', response);
          this.router.navigate(['/login']);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
