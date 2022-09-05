import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chat, ChatMessage} from "../../../../core/services/chat.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

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

  trackBy(index: number, item: Chat) {
    return item.id;
  }
}
