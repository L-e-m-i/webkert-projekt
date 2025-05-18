import { Timestamp } from "@angular/fire/firestore";

export class tweetItem{
    id: string;
    inReplyTo?: string | null = null;
    content: string;
    images?: string[] = [];
    timestamp: Timestamp;
    handle: string;
    username: string;
    comments?: number = 0;
    likes?: number = 0;
    bookmarks?: number = 0;
    //children?: tweetItem[] = [];
    constructor(id: string, tweet: string, images: string[] , handle: string, timestamp: Timestamp, username: string, inReplyTo: string | null = null){
        this.username = username;
        this.id = id;
        this.content = tweet;
        this.images = images;
        this.timestamp = timestamp;
        this.inReplyTo = inReplyTo;
        this.handle = handle;
        this.comments = 0;
        this.likes = 0;
        this.bookmarks = 0;
    }
    // setParentId(id: number){
    //     this.parentId = id;
    // }
    // setLiked(liked: boolean){
    //     this.isLiked = liked;
    // }
    // setBookmarked(bookmarked: boolean){
    //     this.isBookmarked = bookmarked;
    // }
    // setLikes(likes: number){
    //     this.likes = likes;
    // }
}

export const tweetItems: tweetItem[] = [
    new tweetItem('1', 'just saw a user with their bedtime in bio', [], 'johndoe', Timestamp.fromDate(new Date('2025-01-01T12:34:56')), 'John Doe'),
    new tweetItem('2', 'lmao thats me', [], 'alicej', Timestamp.fromDate(new Date('2025-01-02T23:04:01')), 'Alice Johnson'),
    new tweetItem('3', 'WHAT DID YOUNG THUG DO TO THAT FISH???', [], 'johndoe', Timestamp.fromDate(new Date('2025-03-28T13:05:01')), 'John Doe'),
    new tweetItem('4', 'i can\'t believe it', [], 'alicej', Timestamp.fromDate(new Date('2025-03-28T15:35:01')), 'Alice Johnson'),
    new tweetItem('5', 'absolute bonkers', [], 'johndoe', Timestamp.fromDate(new Date('2025-04-05T15:35:01')), 'John Doe'),
    new tweetItem('6', 'Just made some tea', [], 'janesmith', Timestamp.fromDate(new Date('2025-04-05T15:35:01')), 'Jane Smith'),
];