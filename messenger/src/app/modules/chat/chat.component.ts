import {
  Component,
} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {Chat, ChatService} from "../../core/services/chat.service";
import {MatDialog} from "@angular/material/dialog";
import {AddChatModalComponent} from "./components/add-chat-modal/add-chat-modal.component";
import {take} from "rxjs";
import {UsersService} from "../../core/services/users.service";

export enum ChatType {
  Private = 'private',
  Group = 'group'
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public chatType = ChatType;
  constructor(
    public chatService: ChatService,
    public dialog: MatDialog,
    public authService: AuthService,
    public userService: UsersService
  ) {
  }

  public openDialog(): void {
    const dialog = this.dialog.open(AddChatModalComponent);

    dialog.afterClosed()
      .pipe(take(1))
      .subscribe((chatName: { chatName: string }) => {
        if(chatName?.chatName) {
          this.chatService.createNewChat(chatName.chatName);
        }
      });
  }

  public deleteChat(chat: Chat, type: string) {
    type === this.chatType.Private ?
      this.chatService.deletePrivateChat(chat.id, chat.selectedUserId) :
      this.chatService.deleteChat(chat.id);

  }

  public createNewPrivateChat({id, userName}:{id: string; userName: string}) {
    this.chatService.createNewPrivateChat({id, userName});
  }
}
