import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription, take } from 'rxjs';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-edit-profile',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    FormsModule

  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  editProfileForm!: FormGroup;
  selectedImageFile: File | null = null;
  title: string = 'Y / Edit profile';

  user: any;
  userSub: Subscription | null = null;


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router, 
    private titleService: Title,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.initializeForm();

    this.userSub = this.userService.getUserProfile()
    .pipe(take(1))
    .subscribe({
      next: (user) => {
        this.user = user;
        this.editProfileForm.patchValue({
          username: user.user?.username,
          bio: user.user?.bio,
          //image: user.user?.profilePicture,
        });
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    })
  }


  initializeForm(){
    this.editProfileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      bio: [''],
      image: [''],
    });
  }

  async updateProfile(): Promise<void> {
    if (this.editProfileForm.valid) {
      const { username, bio } = this.editProfileForm.value;
      const userId = this.user.user?.id;

      
      return this.userService.updateUserProfile(userId, { username, bio, username_lowercase: username.toLowerCase() })
        .then(async () => {
          const imageFile = this.selectedImageFile;
          if (imageFile) {
            const storage = getStorage();
            const filePath = `profile_pictures/${userId}_${Date.now()}`;
            const fileRef = ref(storage, filePath);
            await uploadBytes(fileRef, imageFile);
            const imageUrl = await getDownloadURL(fileRef);
            await this.userService.updateUserProfile(userId, { profilePicture: imageUrl });
          }
          

          this.router.navigate(['/profile', this.user.user?.handle]);
        })
        .catch((error: any) => {
          console.error('Error updating profile:', error);
        });
    }

    return Promise.reject('Form is invalid');
  }




  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile = input.files[0];
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/profile', this.user.user?.handle]);
  }

  async deleteProfile(): Promise<void>{
    if (!confirm('Are you sure you want to delete your account?')) {
      return;
    }
    const userId = this.user.user?.id;
    this.userService.deleteUser(userId).then(() => {
      this.authService.signOut();
      this.router.navigate(['/']);
    }).catch((error) => {
      console.error('Error deleting user:', error);
    });
  }
}
