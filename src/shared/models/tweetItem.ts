export class tweetItem{
    id: number;
    tweet: string;
    user: string;
    date: string;
    likes: number;
    retweets: number;
    comments: number;
    constructor(id: number, tweet: string, user: string, date: string, likes: number, retweets: number, comments: number){
        this.id = id;
        this.tweet = tweet;
        this.user = user;
        this.date = date;
        this.likes = likes;
        this.retweets = retweets;
        this.comments = comments;
    }
}