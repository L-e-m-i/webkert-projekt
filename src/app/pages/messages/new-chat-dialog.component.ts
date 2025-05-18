import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-new-chat-dialog',
  templateUrl: './new-chat-dialog.component.html',
  styleUrls: ['./new-chat-dialog.component.scss'],
  imports: [
    CommonModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ]
})
export class NewChatDialogComponent {
  searchQuery: string = ''; // Bind this to the search bar

  constructor(
    public dialogRef: MatDialogRef<NewChatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
  ) {
    this.userService.getUserProfile().subscribe((user) => {
    
    });
  }

  onSearch() {

    this.userService.searchUsers(this.searchQuery).then((users) => {
      this.data.users = users;
      console.log(users);
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSelectUser(user: any): void {

    this.userService.getUserReference(user.id).then((userRef) => {
        this.dialogRef.close(userRef);
    })

  }
}