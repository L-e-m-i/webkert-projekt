import { TestBed } from '@angular/core/testing';

import { TweetService } from './tweet.service';

describe('LikedService', () => {
  let service: TweetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
