import { Message } from './message'; // Adjust the path as needed
import { UserService } from '../services/user.service';


export class Chat{
    id: number;
    participants: number[];
    messages: Message[];
    private userService: UserService; // Declare userService
    constructor(id: number, participants: number[], userService: UserService) {
        this.id = id;
        this.participants = participants;
        this.messages = [];
        this.userService = userService; // Initialize userService
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

    getParticipants(): number[] {
        return this.participants;
    }

    getParticipantsExceptUser(userId: number): number[] {
        return this.participants.filter(participant => participant !== userId);
    }

    getUserById(userId: number): any {// Create an instance of UserService
        //console.log(this.userService.getUserById(userId));
        
        return this.userService.getUserById(userId); // Assuming you have a method to get user by ID
    }

    getParticipantNamesExceptUser(userId: number): string[]{
        const participantIds = this.getParticipantsExceptUser(userId);
        //console.log('Participant IDs except user:', participantIds);
        return participantIds.map(id => {
            const user = this.getUserById(id);
            //console.log('User for ID:', id, 'Result:', user);
            return user ? user.username : 'Unknown';
        });
    }

}
