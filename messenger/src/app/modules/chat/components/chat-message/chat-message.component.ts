import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chat, ChatMessage} from "../../../../shared/services/chat.service";

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Input() message!: ChatMessage;
  @Input() isUser!: boolean;
  @Input() userId!: string | undefined;
  @Output() onDeleteMessage = new EventEmitter<string>();
  @Output() onEditMessage = new EventEmitter<ChatMessage>();

  constructor() { }

  ngOnInit(): void {
  }

  public errorHandler(event: any): void {
    event.target.src = 'assets/images/avatar.png';
  }
}
