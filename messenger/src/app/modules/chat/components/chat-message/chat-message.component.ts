import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {
  @Input() message!: any;
  @Input() isUser!: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  public errorHandler(event: any) {
    event.target.src = 'assets/images/avatar.png';
  }

}
