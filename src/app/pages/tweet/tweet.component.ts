import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetComponentShared } from '../../shared/tweet/tweet.component';
import { ActivatedRoute, Params } from '@angular/router';
import { tweetItems } from '../../shared/models/tweetItem';


@Component({
  selector: 'app-tweet',
  imports: [
    CommonModule,
    TweetComponentShared,
  ],
  templateUrl: './tweet.component.html',
  styleUrl: './tweet.component.scss'
})
export class TweetComponent {
  handle!: string; // User handle from route
  id!: number; // Tweet ID from route

  constructor(private route: ActivatedRoute) {}

  items = tweetItems;

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.handle = params['handle'];
      this.id = +params['postId']; 
    });
    console.log(this.handle);
    console.log(this.id);
    for(let i = 0; i < this.items.length; i++){
      if(this.items[i].id == this.id){
        console.log(this.items[i]);
        break;
      }
    }
  }
}
