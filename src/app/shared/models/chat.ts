import { Message } from './message'; // Adjust the path as needed
import { UserService } from '../services/user.service';
import { Time } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';


export class Chat{
    id: string;
    participants: any[];
    messages: Message[];
    lastMessageTime: Timestamp | null = null;
    lastMessage: Message | null = null;
    lastMessageSender: string | null = null;
    title?: string;
    private userService!: UserService; // Declare userService
    constructor(id: string, participants: string[]) {
        this.id = id;
        this.participants = participants;
        this.messages = [];
        //this.userService = userService; // Initialize userService
    }

    addMessage(message: Message) {
        this.messages.push(message);
    }

    getLatestMessage(): Message | null {
        if (this.messages.length === 0) {
            return null;
        }
        return this.messages[this.messages.length - 1];
    }

    getParticipants(): string[] {
        return this.participants;
    }

    getParticipantsExceptUser(userId: string): string[] {
        return this.participants.filter(participant => participant !== userId);
    }

    getUserById(userId: string): any {// Create an instance of UserService
        
        
        return this.userService.getUserById(userId); // Assuming you have a method to get user by ID
    }

    getParticipantNamesExceptUser(userId: string): string[]{
        const participantIds = this.getParticipantsExceptUser(userId);
        
        return participantIds.map((id) => {
            const user = this.getUserById(id);
            
            return user ? user.username : 'Unknown';
        });
    }

    isUserInChat(userId: string): boolean {
        return this.participants.includes(userId);
    }

    setUserService(userService: UserService) {
        this.userService = userService; // Set the userService instance
    }

}
