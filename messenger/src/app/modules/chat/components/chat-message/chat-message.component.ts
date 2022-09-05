import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Chat, ChatMessage} from "../../../../core/services/chat.service";

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

  constructor() { }

  ngOnInit(): void {
  }

  public errorHandler(event: any) {
    event.target.src = 'assets/images/avatar.png';
  }
}
