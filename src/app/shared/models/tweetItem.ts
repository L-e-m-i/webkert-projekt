export class tweetItem{
    id: number;
    parentId?: number | null = null;
    content: string;
    images?: string[] = [];
    username: string;
    handle: string;
    date: string;
    likes: number;
    retweets: number;
    comments: number;
    bookmarks: number;
    isLiked?: boolean = false;
    isBookmarked?: boolean = false;
    isRetweeted?: boolean = false;
    isReply: boolean = false;

    //children?: tweetItem[] = [];
    constructor(id: number, tweet: string, images: string[] , handle: string, user: string, date: string, likes: number, bookmarks: number, retweets: number, comments: number, parentId: number | null = null){
        this.id = id;
        this.content = tweet;
        this.username = user;
        this.handle = handle;
        this.date = date;
        this.likes = likes;
        this.retweets = retweets;
        this.comments = comments;
        this.bookmarks = bookmarks;
        this.parentId = parentId;
        this.isReply = parentId !== null;
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
    new tweetItem(1, 'just saw a user with their bedtime in bio',[], 'johndoe', 'John Doe', '2025-01-01T12:34:56', 10, 12, 420, 2),
    new tweetItem(2, 'lmao thats me', [], 'alicej', 'Alice Johnson', '2025-01-02T23:04:01', 69, 23, 420, 0, 1),
    new tweetItem(3, 'WHAT DID YOUNG THUG DO TO THAT FISH???', [], 'johndoe', 'John Doe', '2025-03-28T13:05:01', 69, 34, 420, 1),
    new tweetItem(4, 'i can\'t believe it', [], 'alicej', 'Alice Johnson', '2025-03-28T15:35:01', 69, 34, 420, 0, 3),
    new tweetItem(5, 'absolute bonkers', [], 'johndoe', 'John Doe', '2025-04-05T15:35:01', 0, 0, 0, 0, 1),
    new tweetItem(6, 'Just made some tea', [], 'janesmith', 'Jane Smith', '2025-04-05T15:35:01', 0, 0, 0, 0),
]