export class Message{
    id: number;
    sender: string;
    timestamp: string;
    content: string;

    constructor(id: number, sender: string, timestamp: string, content: string){
        this.id = id;
        this.sender = sender;
        this.timestamp = timestamp;
        this.content = content;
    }
}