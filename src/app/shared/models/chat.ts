import { Message } from './message'; // Adjust the path as needed

export class Chat{
    id: number;
    participants: string[];
    messages: Message[];

    constructor(id: number, participants: string[]){
        this.id = id;
        this.participants = participants;
        this.messages = [];
    }

}