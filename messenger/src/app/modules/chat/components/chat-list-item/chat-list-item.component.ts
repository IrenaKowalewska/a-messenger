import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Chat} from "../../../../shared/services/chat.service";
import {AddChatModalComponent} from "../add-chat-modal/add-chat-modal.component";
import {take} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AddChatModalData, ChatType} from "../../chat.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss']
})
export class ChatListItemComponent implements OnChanges {
  @Input() chat!: Chat;
  @Input() userId!: string | undefined;
  @Input() isSelectedChat!: boolean;
  @Output() onDeleteChat = new EventEmitter<Chat>();
  @Output() onEditChat = new EventEmitter<AddChatModalData>();
  public isAuthor!: boolean;
  public isSelectedUser!: boolean;
  public photoUserFirstName!: string;
  public photoUserLastName!: string;
  public chatPhoto: string | undefined = '';
  public isBase64Photo!: boolean;

  constructor(public dialog: MatDialog, private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['chat']) {
      this.isAuthor = this.userId === this.chat.authorId;
      this.isSelectedUser = this.userId === this.chat.selectedUserId;
      this.photoUserFirstName =
        this.chat.chatType === ChatType.Group ? this.getWord(this.chat.name, 0)
          : this.isAuthor ? this.getWord(this.chat.selectedUserName, 0) : this.getWord(this.chat.name, 0);

      this.photoUserLastName =
        this.chat.chatType === ChatType.Group ? this.getWord(this.chat.name, 1)
          : this.isAuthor ? this.getWord(this.chat.selectedUserName, 1) : this.getWord(this.chat.name, 1);

      this.chatPhoto = this.chat.chatType === ChatType.Group ? this.chat.image
        : this.isAuthor ? this.chat.selectedUserPhoto : this.chat.authorPhoto;

      this.isBase64Photo = !!(this.chat.image);
    }
  }

  public editChat(chat: Chat): void {
    const dialog = this.dialog.open(AddChatModalComponent, {
      data: {
        isEdit: true,
        chat: chat
      }
    });

    dialog.afterClosed()
      .pipe(take(1))
      .subscribe((newChat: AddChatModalData) => {
        if(newChat?.chatName) {
          this.onEditChat.emit(newChat);
        }
      });
  }

  private getWord(text: string, index: number): string {
    return text?.split(' ')[index]
  }

  public openChat(id: string): void {
    this.router.navigate(['/chats', id]);
  }
}
