import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ChatType} from "../../chat.component";
import {ChatTab} from "../chats-list/chats-list.component";

@Component({
  selector: 'app-chat-list-tab',
  templateUrl: './chat-list-tab.component.html',
  styleUrls: ['./chat-list-tab.component.scss']
})
export class ChatListTabComponent {
  @Input() chatTab!: ChatTab;
  @Output() onSelectedType = new EventEmitter<ChatType>();
  public chatTypes = ChatType;
}
