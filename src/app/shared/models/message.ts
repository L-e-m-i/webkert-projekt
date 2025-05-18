import { Timestamp } from "@angular/fire/firestore";

export class Message{
    id: number;
    senderId: number;
    timestamp: Timestamp;
    content: string;

    constructor(id: number, senderId: number, timestamp: Timestamp, content: string){
        this.id = id;
        this.senderId = senderId;
        this.timestamp = timestamp;
        this.content = content;
    }
    static messageId = 5; // Static variable to keep track of the next message ID
}

