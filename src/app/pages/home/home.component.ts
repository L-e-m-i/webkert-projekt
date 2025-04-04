import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tweetItem, tweetItems } from '../../shared/models/tweetItem';
import { MatIcon } from '@angular/material/icon';
import { TweetService } from '../../shared/services/tweet.service';
import { Router } from '@angular/router';
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { UserService } from '../../shared/services/user.service';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';

@Component({
  selector: 'app-home',
  imports: [
    //MatIcon,
    //DateFormatterPipe,
    TweetComponentShared,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
    private tweetService: TweetService,
    private userService: UserService,
    private router: Router
  ) { }  

  user: any; 

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  items = tweetItems;


  navigateToPost(tweet: tweetItem): void {
    this.router.navigate([tweet.handle, tweet.id]);
  }
}
