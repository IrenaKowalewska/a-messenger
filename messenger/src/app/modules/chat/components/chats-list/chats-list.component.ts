import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Chat} from "../../../../core/services/chat.service";
import {AddChatModalData, ChatType} from "../../chat.component";
import {take} from "rxjs";
import {ActivatedRoute} from "@angular/router";

export interface ChatTab {
  chatType: ChatType;
  isSelected: boolean;
}

const CHAT_TABS_CONFIG = [
  {chatType: ChatType.Group, isSelected: true},
  {chatType: ChatType.Private, isSelected: false}
]

@Component({
  selector: 'app-chats-list',
  templateUrl: './chats-list.component.html',
  styleUrls: ['./chats-list.component.scss']
})
export class ChatsListComponent implements OnInit {
  @Input() chats!: any;
  @Input() userId!: string | undefined;
  @Input() link!: string;
  @Input() isPrivateList!: boolean;
  @Input() selectedChat!: Chat | null | undefined;
  @Output() onDeleteChat = new EventEmitter<Chat>();
  @Output() onEditChat = new EventEmitter<AddChatModalData>();
  @Output() onOpenDialog = new EventEmitter<void>();
  public chatTabsConfig: ChatTab[] = CHAT_TABS_CONFIG;
  public chatTypes = ChatType;
  public chatType!: ChatType;

  constructor(private route: ActivatedRoute,) {}

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe((data: any) => {
      this.chatType =  data.selectedChat?.chatType || ChatType.Group;
      this.onSelectedTab(this.chatType);
    });
  }

  public onSelectedTab(type: ChatType) {
    this.chatType = type;
    this.chatTabsConfig = this.chatTabsConfig.map(tab => {
      return tab.chatType === type ? {...tab, isSelected: true} : {...tab, isSelected: false};
    });
  }

  public deleteChat(chat: Chat) {
    this.onDeleteChat.emit(chat);
  }
}
