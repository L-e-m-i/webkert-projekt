export class Message{
    id: number;
    senderId: number;
    timestamp: string;
    content: string;

    constructor(id: number, senderId: number, timestamp: string, content: string){
        this.id = id;
        this.senderId = senderId;
        this.timestamp = timestamp;
        this.content = content;
    }
    static messageId = 5; // Static variable to keep track of the next message ID
}

export const messages: Message[] = [
    new Message(1, 1, '2025-01-01T12:34:56', 'Hello! How are you?'),
    new Message(2, 2, '2025-01-02T23:04:01', 'I am good, thanks! How about you?'),
    new Message(3, 1, '2025-03-28T13:05:01', 'Just working on some projects.'),
    new Message(4, 2, '2025-03-28T15:35:01', 'That sounds interesting! What projects?'),
]