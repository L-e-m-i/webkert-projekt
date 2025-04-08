export class Profile {
    id: number;
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
    
    static profileId = 4; // Static variable to keep track of the next profile ID
    constructor(id: number, name: string, handle: string, email: string, password: string){
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

export const profiles: Profile[] = [
    {
        id: 1,
        username: "peanitsjorker",
        handle: "johndoe",
        age: 30,
        email: "johndoe@example.com",
        password: "password123",
        bio: "Tech enthusiast and coffee lover.",
        tweets: [1,3],
        followers: [2, 3],
        following: [2, 4],
        likes: [],
        retweets: [],
        replies: [],
        bookmarks: [],
        profilePicture: "johndoe.png",
    },
    {
        id: 2,
        username: "Jane Smith",
        handle: "janesmith",
        age: 25,
        email: "janesmith@example.com",
        password: "mypassword",
        bio: "Traveler and photographer.",
        tweets: [104, 105],
        followers: [1, 3],
        following: [1, 4],
        likes: [],
        retweets: [],
        replies: [],
        bookmarks: [],
        //profilePicture: "janesmith.jpg"
    },
    {
        id: 3,
        username: "Alice Johnson",
        handle: "alicej",
        age: 28,
        email: "alicej@example.com",
        password: "alicepassword",
        bio: "Writer and bookworm.",
        tweets: [106],
        followers: [1, 2],
        following: [4],
        likes: [],
        retweets: [],
        replies: [],
        bookmarks: [],
        //profilePicture: "alicejohnson.jpg"
    }
];