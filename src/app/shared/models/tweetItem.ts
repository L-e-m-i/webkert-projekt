export class tweetItem{
    id: number;
    parentId?: number = 0;
    content: string;
    user: string;
    handle: string;
    date: string;
    likes: number;
    retweets: number;
    comments: number;
    bookmarks: number;
    isLiked?: boolean = false;
    isBookmarked?: boolean = false;
    isRetweeted?: boolean = false;
    constructor(id: number, tweet: string, handle: string, user: string, date: string, likes: number, bookmarks: number, retweets: number, comments: number){
        this.id = id;
        this.content = tweet;
        this.user = user;
        this.handle = handle;
        this.date = date;
        this.likes = likes;
        this.retweets = retweets;
        this.comments = comments;
        this.bookmarks = bookmarks;
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
    new tweetItem(1, 'WHO UP JORKING THEY PEANITS RN?', 'johndoe', 'peanitsjorker', '2025-01-01T12:34:56', 69, 12, 420, 666),
    new tweetItem(2, 'in the clurb straight up jorking it', 'user2', 'user2', '2025-01-02T23:04:01', 69, 23, 420, 666),
    new tweetItem(3, 'jorking it in the clurb', 'johndoe', 'peanitsjorker', '2025-03-28T13:05:01', 69, 34, 420, 666),
    new tweetItem(4, 'Go woke go Jork', 'user4', 'user4', '2025-03-28T15:35:01', 69, 34, 420, 666),
  
]