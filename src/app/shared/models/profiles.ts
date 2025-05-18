export class Profile {
    id: string;
    username: string;
    handle: string;
    email: string;
    password: string;
    age?: number;
    bio?: string;
    tweets?: number[];
    followers?: number[];
    following?: number[];
    likes?: number[];
    retweets?: number[];
    replies?: number[];
    bookmarks?: number[];
    profilePicture?: string;
    bannerPicture?: string;
    username_lowercase?: string;
    handle_lowercase?: string;
    
    static profileId = 4; // Static variable to keep track of the next profile ID
    constructor(id: string, name: string, handle: string, email: string, password: string){
        this.id = id;
        this.username = name;
        this.handle = handle;
        this.email = email;
        this.password = password;
        this.age = 18;
        this.bio = '';
        this.tweets = [];
        this.followers = [];
        this.following = [];
        this.likes = [];
        this.retweets = [];
        this.replies = [];
        this.bookmarks = [];
        
    }

    
}