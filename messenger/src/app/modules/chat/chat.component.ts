import {
  Component, OnDestroy, OnInit,
} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {Chat, ChatMessage, ChatService} from "../../shared/services/chat.service";
import {MatDialog} from "@angular/material/dialog";
import {AddChatModalComponent} from "./components/add-chat-modal/add-chat-modal.component";
import {Subject, take, takeUntil} from "rxjs";
import {User, UsersService} from "../../shared/services/users.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

export enum ChatType {
  Group = 'All',
  Private = 'Private'
}

export interface AddChatModalData {
  chatName: string;
  chatImage: string;
  chatType: string;
  selectedUserName: string;
  selectedUserId: string;
  id?: string;
  authorId?: string;
  lastMessage?: string;
  selectedUserPhoto?: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  public chatType = ChatType;
  public isSelectedChat = false;
  public chats!: Chat[];
  public isChatsOpen = false;
  public selectedChat!: Chat | null;
  public messages!: ChatMessage[];
  public user!: User | null;

  private onDestroy = new Subject<boolean>();

  constructor(
    public chatService: ChatService,
    public dialog: MatDialog,
    public authService: AuthService,
    public userService: UsersService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.chatService.selectedChat$.subscribe(chat => {
      this.selectedChat = chat;
    });

    this.userService.userInfo$.pipe(take(1)).subscribe((user: User | null) => {
      this.user = user;
    });

    this.route.data.pipe(take(1)).subscribe((data: any) => {
      this.chats = data.chats;
      this.selectedChat = data.selectedChat;
    });

    this.chatService.chats.subscribe((chats: Chat[]) => {
      this.chats = chats;
    });

  }

  ngOnDestroy() {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

  public openDialog(): void {
    const dialog = this.dialog.open(AddChatModalComponent, {
      data: {
        isEdit: false,
      }
    });

    dialog.afterClosed()
      .pipe(take(1))
      .subscribe((newChat: AddChatModalData) => {
        if(newChat?.chatName) {
          this.chatService.createNewChat(newChat);
        }
      });
  }

  public deleteChat(chat: Chat) {
    this.chatService.deleteChat(chat.id);
  }

  public editChat(newChatData: AddChatModalData) {
    this.chatService.updateChat(newChatData);
  }

}
