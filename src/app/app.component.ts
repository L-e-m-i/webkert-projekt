import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { tweetItem } from '../shared/models/tweetItem';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  items: tweetItem[] = [
    new tweetItem(1, 'Tweet 1', 'User 1', '2025-01-01', 69, 420, 666),
    new tweetItem(2, 'Tweet 2', 'User 2', '2025-01-02', 69, 420, 666)
  ];
  title = 'Y';
}
