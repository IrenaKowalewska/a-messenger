import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Chat} from "../../../../core/services/chat.service";

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent {
  @Input() chats!: any;
  @Input() userId!: string | undefined;
  @Input() link!: string;
  @Input() isPrivateList!: boolean;
  @Output() onDeleteChat = new EventEmitter<Chat>();
  @Output() onOpenDialog = new EventEmitter<void>();

  public deleteChat(chat: Chat) {
    this.onDeleteChat.emit(chat);
  }
}
