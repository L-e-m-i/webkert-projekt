import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetComponentShared } from './tweet.component';

describe('TweetComponent', () => {
  let component: TweetComponentShared;
  let fixture: ComponentFixture<TweetComponentShared>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TweetComponentShared]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TweetComponentShared);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
