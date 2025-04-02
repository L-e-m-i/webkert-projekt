import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { TweetService } from '../../shared/services/tweet.service';
import { tweetItem } from '../../shared/models/tweetItem';

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

  constructor(
    private userService: UserService,
    private tweetService: TweetService,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.user = this.userService.getUser();
    console.log(this.tweetService.getTweets());
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
  
    const tweet: tweetItem = {
      id: Date.now(), // Use a timestamp as a unique ID
      user: this.user.name,
      content: this.post.value.trim(),
      date: new Date().toISOString(),
      likes: 0,
      retweets: 0,
      comments: 0,
      isLiked: false,
      isRetweeted: false,
      handle: this.user?.handle ?? '',
      bookmarks: 0,
      isBookmarked: false,
    };
  
    this.tweetService.addTweet(tweet);
    console.log('Tweet added:', tweet);
    this.post.reset();
    this.router.navigate(['/home']);
  }

}
