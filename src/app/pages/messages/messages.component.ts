import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

import { UserService } from '../../shared/services/user.service';
import { Chat } from '../../shared/models/chat'; 
import { DateFormatterPipe } from '../../shared/pipes/date.pipe';
import { Message } from '../../shared/models/message';
import { Title } from '@angular/platform-browser';
import { Subscription, take } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { NewChatDialogComponent } from './new-chat-dialog.component'; // Import the dialog component
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { Profile } from '../../shared/models/profiles';



@Component({
  selector: 'app-messages',
  imports: [
    MatProgressSpinnerModule,
    CommonModule,
    MatIcon,
    DateFormatterPipe,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  // @Input() chats!: Chat[];
  

  title: string = 'Y / Messages';
  constructor(
    private userService: UserService,
    private router: Router,
    private titleService: Title,
    private dialog: MatDialog // Inject MatDialog
  ) { }



  user: any; 
  userSub: Subscription | null = null;
  chats: Chat[] = [];
  participantsExceptUser: Profile | null = null;
  isLoading: boolean = true;

  ngOnInit(): void {
    this.titleService.setTitle(this.title);
    this.userSub = this.userService.getUserProfile().pipe(take(1)).subscribe({
      next: (user) => {
        if(!user){
          this.router.navigate(['/login']);
          return;
        }
        this.user = user;
        
        if (user.id) {
          this.userService.getChatsByUserId(user.id).then((chats: Chat[]) => {
            this.chats = chats;
            this.chats.forEach((chat) => {
              const participantsExceptUser = chat.participants.filter((participant) => participant.id !== user.id);
              this.participantsExceptUser = participantsExceptUser[0];
              
              
              chat.title = participantsExceptUser.map((participant) => participant.username).join(', ');
            })

            this.isLoading = false;
          }).catch((error) => {
            console.error('Error fetching chats:', error);
          });
           
        } else {
          console.error('User ID is null or undefined');
          return;
        }
      }
    });  
  }

 
  trackByChatId(index: number, chat: Chat): string {
    return chat.id;
  }

  openChat(chatId: string) {
    // Navigate to the chat component with the selected chat ID
    this.router.navigate(['/chat', chatId]);
  }

  openNewChat() {
    const dialogRef = this.dialog.open(NewChatDialogComponent, {
      width: '400px',
      data: {} // Pass any data if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.getUserReference(this.user.id).then((userRef) => { 
          this.userService.createChat([userRef, result]).then(() => {

          })
        }).catch((error) => {

        });
        // Optionally, you can refresh the chat list or show a success message
        this.userService.getChatsByUserId(this.user.id).then((chats: Chat[]) => {
          this.chats = chats;
          this.chats.forEach((chat) => {
            const participantsExceptUser = chat.participants.filter((participant) => participant !== this.user.id);
            chat.title = participantsExceptUser.map((participant) => participant.username).join(', ');
          })
        }).catch((error) => {
          console.error('Error fetching chats:', error);
        });
      }
    });
  }

  deleteChat(chatId: string) {
    if (!confirm('Are you sure you want to delete this chat?')) {
      return;
    }
    this.userService.deleteChat(chatId).then(() => {
      // Optionally, you can refresh the chat list or show a success message      
      this.chats = this.chats.filter(chat => chat.id !== chatId);
    }).catch((error) => {
      console.error('Error deleting chat:', error);
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
