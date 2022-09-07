import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Chat} from "../../../../core/services/chat.service";
import {AddChatModalComponent} from "../add-chat-modal/add-chat-modal.component";
import {take} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AddChatModalData, ChatType} from "../../chat.component";

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss']
})
export class ChatListItemComponent implements OnInit, OnChanges {
  @Input() chat!: Chat;
  @Input() userId!: string | undefined;
  @Input() link!: string;
  @Input() isSelectedChat!: boolean;
  @Output() onDeleteChat = new EventEmitter<Chat>();
  @Output() onEditChat = new EventEmitter<AddChatModalData>();
  public isAuthor!: boolean;
  public isSelectedUser!: boolean;
  public photoUserFirstName!: string;
  public photoUserLastName!: string;
  public chatPhoto: string | undefined = '';
  public isBase64Photo!: boolean;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['chat']) {
      this.isAuthor = this.userId === this.chat.authorId;
      this.isSelectedUser = this.userId === this.chat.selectedUserId;
      this.photoUserFirstName =
        this.chat.chatType === ChatType.Group ? this.chat.name?.split(' ')[0]
          : this.isAuthor ? this.chat.selectedUserName?.split(' ')[0] : this.chat.name?.split(' ')[0];

      this.photoUserLastName =
        this.chat.chatType === ChatType.Group ? this.chat.name?.split(' ')[1]
          : this.isAuthor ? this.chat.selectedUserName?.split(' ')[1] : this.chat.name?.split(' ')[1];

      this.chatPhoto = this.chat.chatType === ChatType.Group ? this.chat.image
        : this.isAuthor ? this.chat.selectedUserPhoto : this.chat.authorPhoto;

      this.isBase64Photo = !!(this.chat.image);
    }
  }

  public editChat(chat: Chat) {
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
}
