export interface Profile {
    id: number;
    name: string;
    handle: string;
    age: number;
    email: string;
    bio: string;
    tweets: number[];
    followers: number[];
    following: number[];
    likes: number[];
    retweets: number[];
    replies: number[];
    bookmarks: number[];
}

export const profiles: Profile[] = [
    {
        id: 1,
        name: "John Doe",
        handle: "@johndoe",
        age: 30,
        email: "johndoe@example.com",
        bio: "Tech enthusiast and coffee lover.",
        tweets: [101, 102, 103],
        followers: [2, 3],
        following: [2, 4],
        likes: [201, 202],
        retweets: [301],
        replies: [401],
        bookmarks: [501]
    },
    {
        id: 2,
        name: "Jane Smith",
        handle: "@janesmith",
        age: 25,
        email: "janesmith@example.com",
        bio: "Traveler and photographer.",
        tweets: [104, 105],
        followers: [1, 3],
        following: [1, 4],
        likes: [203, 204],
        retweets: [302],
        replies: [402],
        bookmarks: [502]
    },
    {
        id: 3,
        name: "Alice Johnson",
        handle: "@alicej",
        age: 28,
        email: "alicej@example.com",
        bio: "Writer and bookworm.",
        tweets: [106],
        followers: [1, 2],
        following: [4],
        likes: [205],
        retweets: [303],
        replies: [403],
        bookmarks: [503]
    }
];