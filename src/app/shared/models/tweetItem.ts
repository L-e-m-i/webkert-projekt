export class tweetItem{
    id: number;
    parentId?: number | null = null;
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
    isReply: boolean = false;
    //children?: tweetItem[] = [];
    constructor(id: number, tweet: string, handle: string, user: string, date: string, likes: number, bookmarks: number, retweets: number, comments: number, parentId: number | null = null){
        this.id = id;
        this.content = tweet;
        this.user = user;
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
    new tweetItem(1, 'WHO UP JORKING THEY PEANITS RN?', 'johndoe', 'peanitsjorker', '2025-01-01T12:34:56', 0, 12, 420, 2),
    new tweetItem(2, 'in the clurb straight up jorking it', 'user2', 'user2', '2025-01-02T23:04:01', 69, 23, 420, 0, 1),
    new tweetItem(3, 'jorking it in the clurb', 'johndoe', 'peanitsjorker', '2025-03-28T13:05:01', 69, 34, 420, 1),
    new tweetItem(4, 'Go woke go Jork', 'user4', 'user4', '2025-03-28T15:35:01', 69, 34, 420, 0, 3),
    new tweetItem(5, 'i replied', 'johndoe', 'peanitsjorker', '2025-04-05T15:35:01', 0, 0, 0, 0, 1)
]