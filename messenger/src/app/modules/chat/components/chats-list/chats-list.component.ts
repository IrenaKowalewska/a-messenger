import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Chat} from "../../../../core/services/chat.service";
import {ChatType} from "../../chat.component";
import {take} from "rxjs";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent implements OnInit, OnChanges {
  @Input() chats!: any;
  @Input() userId!: string | undefined;
  @Input() link!: string;
  @Input() isPrivateList!: boolean;
  @Input() selectedChat!: Chat | null | undefined;
  @Output() onDeleteChat = new EventEmitter<Chat>();
  @Output() onOpenDialog = new EventEmitter<void>();
  public chatTypes = ChatType;
  public chatType!: ChatType;

  constructor(private route: ActivatedRoute,) {}

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe((data: any) => {
      this.chatType = data.selectedChat?.chatType || ChatType.Group;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedChat']) {
      this.chatType = this.selectedChat?.chatType || ChatType.Group;
    }
  }

  public deleteChat(chat: Chat) {
    this.onDeleteChat.emit(chat);
  }

  trackBy(index: number, item: Chat) {
    return item.id;
  }
}
