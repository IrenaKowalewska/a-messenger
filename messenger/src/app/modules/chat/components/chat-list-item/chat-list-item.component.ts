import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chat} from "../../../../core/services/chat.service";

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss']
})
export class ChatListItemComponent implements OnInit {
  @Input() chat!: Chat;
  @Input() userId!: string | undefined;
  @Input() link!: string;
  @Output() onDeleteChat = new EventEmitter<Chat>();
  public pref = 'data:image/jpeg;base64,';
  public isUser!: boolean;
  public isSelectedUser!: boolean;
  public photoUserFirstName!: string;
  public photoUserLastName!: string;

  constructor() { }

  ngOnInit(): void {
  this.isUser = this.userId === this.chat.authorId;
  this.isSelectedUser = this.userId === this.chat.selectedUserId;
  this.photoUserFirstName =
    this.isUser ? this.chat.selectedUserName?.split(' ')[0] : this.chat.name?.split(' ')[0];

  this.photoUserLastName =
    this.isUser ? this.chat.selectedUserName?.split(' ')[1] : this.chat.name?.split(' ')[1];
  }

}
