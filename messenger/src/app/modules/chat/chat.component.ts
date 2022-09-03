import {
  Component, OnInit,
} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {Chat, ChatService} from "../../core/services/chat.service";
import {MatDialog} from "@angular/material/dialog";
import {AddChatModalComponent} from "./components/add-chat-modal/add-chat-modal.component";
import {take} from "rxjs";
import {UsersService} from "../../core/services/users.service";
import {ActivatedRoute, Params} from "@angular/router";

export enum ChatType {
  Private = 'private',
  Group = 'group'
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  public chatType = ChatType;
  public isSelectedChat = false;
  public chats!: Chat[];

  constructor(
    public chatService: ChatService,
    public dialog: MatDialog,
    public authService: AuthService,
    public userService: UsersService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe((data: any) => {
      this.chats = data.chats;
    });

    this.route.params.subscribe((params: Params) => {
      if(params['id']) {
        this.isSelectedChat = true;
      }
    });

    this.chatService.chats.subscribe((chats: Chat[]) => {
      this.chats = chats;
    })
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
