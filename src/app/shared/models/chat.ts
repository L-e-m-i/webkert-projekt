import { Message } from './message'; // Adjust the path as needed
import { UserService } from '../services/user.service';


export class Chat{
    id: string;
    participants: string[];
    messages: Message[];
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
        //console.log(this.userService.getUserById(userId));
        
        return this.userService.getUserById(userId); // Assuming you have a method to get user by ID
    }

    getParticipantNamesExceptUser(userId: string): string[]{
        const participantIds = this.getParticipantsExceptUser(userId);
        //console.log('Participant IDs except user:', participantIds);
        return participantIds.map((id) => {
            const user = this.getUserById(id);
            //console.log('User for ID:', id, 'Result:', user);
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
export const chats: Chat[] = [
    new Chat('1', ['1', '3']),
    new Chat('2', ['1', '3']),
    new Chat('3', ['2', '3']),
];

// Adding messages to the chats
chats[0].addMessage({ id: 1, senderId: 1, content: 'Hello!', timestamp: new Date().toISOString() });
chats[0].addMessage({ id: 2, senderId: 3, content: 'Hi there!', timestamp: new Date().toISOString() });

chats[1].addMessage({ id: 3, senderId: 1, content: 'How are you?', timestamp: new Date().toISOString() });
chats[1].addMessage({ id: 4, senderId: 3, content: 'I am good, thanks!', timestamp: new Date().toISOString() });

chats[2].addMessage({ id: 5, senderId: 2, content: 'Hey!', timestamp: new Date().toISOString() });
chats[2].addMessage({ id: 6, senderId: 3, content: 'Hello!', timestamp: new Date().toISOString() });