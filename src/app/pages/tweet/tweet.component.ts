import { Component, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { ActivatedRoute, Params } from '@angular/router';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { TweetService } from '../../shared/services/tweet.service';
import { Router } from '@angular/router';

import { RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-tweet',
  imports: [
    CommonModule,
    TweetComponentShared,
    MatFormFieldModule,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './tweet.component.html',
  styleUrl: './tweet.component.scss'
})
export class TweetComponent {
  @ViewChild(TweetComponentShared) tweetShared!: TweetComponentShared;

  handle!: string; // User handle from route
  id!: number; // Tweet ID from route
  reply = new FormControl('');


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tweetService: TweetService,
    private userService: UserService,
    private titleService: Title,
  ) {}

  items = tweetItems;
  title = ''; // Title for the page
  ngOnInit(): void {
    //console.log(this.getReplies(2))
    this.route.params.subscribe((params: Params) => {
      console.log(params);
      this.handle = params['handle'];
      this.id = +params['postId']; 
    });

    this.title = `Y / Tweet by ${this.handle}`; // Set the title based on the user handle
    this.titleService.setTitle(this.title);
    //console.log(this.handle);
    //console.log(this.id);
    
  }

  isReply(tweet: any): boolean {
    return tweet.parentId !== undefined && tweet.parentId !== null;
  }

  navigateToPost(tweet: any): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }

  navigateToReply(tweet: tweetItem): void {
    const parent = this.items.find((t: tweetItem) => t.id === tweet.parentId);
    if (parent) {
      this.router.navigate([parent.handle, parent.id]);
    } else {
      console.error('Parent tweet not found:', tweet.parentId);
    }
  }


  getReplies(tweetId: number): tweetItem[] {
    return this.tweetService.getReplies(tweetId);
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

  postReply(): void{
    if (!this.reply.value?.trim()) {
      //console.error('Tweet content is empty');
      return;
    }
    let replyValue = this.reply.value.trim();
    replyValue = this.reply.value.replace(/\n/g, '<br>'); // Replace newlines with spaces
    
    const user = this.userService.getUser();
    //console.log(user);
    const tweet = new tweetItem(Date.now(), replyValue, user.handle, user.username, new Date().toISOString(), 0, 0, 0, 0, this.id);
    this.userService.addReply(tweet.id)
    this.tweetService.addTweet(tweet);
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto'; // Reset the height to default
    }
    this.reply.reset();
  }

}
