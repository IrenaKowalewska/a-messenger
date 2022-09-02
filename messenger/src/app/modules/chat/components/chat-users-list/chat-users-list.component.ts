import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../../../core/services/users.service";

@Component({
  selector: 'app-chat-users-list',
  templateUrl: './chat-users-list.component.html',
  styleUrls: ['./chat-users-list.component.scss']
})
export class ChatUsersListComponent implements OnInit {
  @Input() users!: User[];
  @Input() userId!: string | undefined;
  @Output() onNewPrivateChat = new EventEmitter<{id: string; userName: string}>();

  constructor() { }

  ngOnInit(): void {
  }

  public errorHandler(event: any) {
    event.target.src = 'assets/images/avatar.png';
  }

  public createNewChat(id: string, userName: string) {
    this.onNewPrivateChat.emit({id, userName});
  }

}
