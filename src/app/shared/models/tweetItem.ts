export class tweetItem{
    id: number;
    parentId: number = 0;
    tweet: string;
    user: string;
    handle: string;
    date: string;
    likes: number;
    retweets: number;
    comments: number;
    bookmarks: number;
    liked: boolean = false;
    bookmarked: boolean = false;
    retweeted: boolean = false;
    constructor(id: number, tweet: string, handle: string, user: string, date: string, likes: number, bookmarks: number, retweets: number, comments: number){
        this.id = id;
        this.tweet = tweet;
        this.user = user;
        this.handle = handle;
        this.date = date;
        this.likes = likes;
        this.retweets = retweets;
        this.comments = comments;
        this.bookmarks = bookmarks;
    }
    setParentId(id: number){
        this.parentId = id;
    }
    setLiked(liked: boolean){
        this.liked = liked;
    }
    setBookmarked(bookmarked: boolean){
        this.bookmarked = bookmarked;
    }
    setLikes(likes: number){
        this.likes = likes;
    }
}