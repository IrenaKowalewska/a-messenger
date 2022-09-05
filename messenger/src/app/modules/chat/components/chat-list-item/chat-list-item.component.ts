import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chat} from "../../../../core/services/chat.service";

@Component({
  selector: 'app-chat-list-item',
  templateUrl: './chat-list-item.component.html',
  styleUrls: ['./chat-list-item.component.scss']
})
export class ChatListItemComponent implements OnInit {
  @Input() chat!: Chat;
  @Input() isUser!: boolean;
  @Input() link!: string;
  @Output() onDeleteChat = new EventEmitter<Chat>();
  public pref = 'data:image/jpeg;base64,'

  constructor() { }

  ngOnInit(): void {
  }

}
