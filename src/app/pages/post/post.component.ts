import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { TweetService } from '../../shared/services/tweet.service';
import { tweetItem } from '../../shared/models/tweetItem';
import { Title } from '@angular/platform-browser';
import { Subscription, take } from 'rxjs';


@Component({
  selector: 'app-post',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  post = new FormControl('');
  user: any; 
  error: string = '';
  title: string = 'Y / Post'; 
  private userSub!: Subscription;


  constructor(
    private userService: UserService,
    private tweetService: TweetService,
    private router: Router,
    private titleService: Title,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.loadProfileData();
    
    this.post = new FormControl('', [Validators.required, Validators.maxLength(140)]);
  }

  loadProfileData() {
    if(!this.userService.checkLoginStatus()) {
      this.user = null; // Set user to null if not logged in
    }
    this.userService.getUserProfile().pipe(take(1)).subscribe({
      next: (user) => {
        this.user = user;

      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    })
  }

  isLoggedIn(): boolean {
    return this.userService.checkLoginStatus();
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  adjustTextareaHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Reset the height to calculate the new height
    if (textarea.scrollHeight < 300) {
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the content
    }else{
      textarea.style.height = '300px'; // Set a maximum height
    }
  }

  postTweet(): void {
    this.error = '';
    //event.preventDefault(); // Prevent the default form submission behavior
    
    if (!this.post.value?.trim()) {
      
      //console.error('Tweet content is empty');
      this.error = 'Please enter a tweet.';
      return;
    }
    let postValue = this.post.value.trim();
    postValue = this.post.value.replace(/\n/g, '<br>'); // Replace newlines with spaces
    this.userService.postTweet(postValue);
   
   
   
    this.post.reset();
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
