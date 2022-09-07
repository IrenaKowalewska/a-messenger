import {
  AfterContentChecked, AfterViewChecked,
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, Input,
  OnDestroy,
  OnInit, Output,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {AuthService} from "../../../../core/services/auth.service";
import {Chat, ChatMessage, ChatService} from "../../../../core/services/chat.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject, take, takeUntil} from "rxjs";
import {User, UsersService} from "../../../../core/services/users.service";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements AfterViewInit {
  @Input() selectedChat!: Chat | null;
  @Input() messages!: ChatMessage[];
  @Input() user!: User | null;
  @Output() isOpenChat = new EventEmitter<void>();
  @Output() deleteMessage = new EventEmitter<{id: string, lastMessage: string}>();
  @Output() onSendMessage = new EventEmitter<string>();
  @Output() onEditMessage = new EventEmitter<{message:ChatMessage; lastMessage: string}>();
  @ViewChild('scrollframe', {static: false}) scrollFrame!: ElementRef;
  @ViewChildren('chatItem') itemElements!: QueryList<any>;
  private scrollContainer: any;
  private isNearBottom = true;
  public isEdit = false;
  public editedMessage!: ChatMessage;
  public messageText = '';

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.pipe().subscribe(_ => this.onItemElementsChanged());
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  trackBy(index: number, item: ChatMessage): string {
    return item.id;
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  public sendMessage(messageText: string): void {
    if(!messageText.length) return;
    if(this.isEdit) {
      if(messageText === this.editedMessage.message) {
        this.messageText = '';
        this.isEdit = false;
        return;
      }
      const newMessage = {
        ...this.editedMessage,
        message: messageText
      };
      let lastMessage = this.messages[this.messages.length - 1];
      lastMessage = lastMessage.id === this.editedMessage.id ? newMessage : this.messages[this.messages.length - 1];
      this.onEditMessage.emit({message: newMessage, lastMessage: lastMessage.message});
      this.isEdit = false;
    } else {
      this.onSendMessage.emit(messageText);
    }
  }

  public onDeleteMessage(id: string): void {
    let lastMessage = this.messages[this.messages.length - 1];
    lastMessage = lastMessage.id === id ? this.messages[this.messages.length - 2] : lastMessage;
    this.deleteMessage.emit({id, lastMessage: lastMessage?.message || ''})
  }

  public editMessage(message: ChatMessage): void {
    this.isEdit = true;
    this.messageText = message.message;
    this.editedMessage = message;
  }
}
