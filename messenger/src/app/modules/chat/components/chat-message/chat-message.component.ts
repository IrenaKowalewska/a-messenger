import {Component, Input, OnInit} from '@angular/core';
import {ChatMessage} from "../../../../core/services/chat.service";

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Input() message!: ChatMessage;
  @Input() isUser!: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  public errorHandler(event: any) {
    event.target.src = 'assets/images/avatar.png';
  }

}
