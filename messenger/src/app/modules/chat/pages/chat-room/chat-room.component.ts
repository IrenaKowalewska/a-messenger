import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {AuthService} from "../../../../core/services/auth.service";
import {Chat, ChatMessage, ChatService} from "../../../../core/services/chat.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subject, takeUntil} from "rxjs";
import {User, UsersService} from "../../../../core/services/users.service";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewInit {
  public messages!: ChatMessage[];
  public messageText = '';
  public user!: User | null;
  @ViewChild('scrollframe', {static: false}) scrollFrame!: ElementRef;
  @ViewChild('input', {static: false}) input!: ElementRef;
  @ViewChildren('chatItem') itemElements!: QueryList<any>;
  private scrollContainer: any;
  private isNearBottom = true;
  public showEmojiPicker = false;
  private onDestroy = new Subject<boolean>();
  public selectedChat!: Chat | null;
  public isPrivateChat = false;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if(params['privateId']) {
        this.chatService.privateChatId.next(params['privateId']);
        this.isPrivateChat = true;
      } else {
        this.chatService.chatId.next(params['id']);
      }
    });

    if(this.isPrivateChat) {
      this.chatService.selectedPrivateChat.pipe(takeUntil(this.onDestroy))
        .subscribe((chat: Chat | undefined) => {
          if(!chat) {
            this.router.navigate(['/chats']);
            return;
          }
          this.selectedChat = chat;
        });
    } else {
      this.chatService.selectedChat.pipe(takeUntil(this.onDestroy))
        .subscribe((chat: Chat | undefined) => {
          if(!chat) {
            this.router.navigate(['/chats']);
            return;
          }
          this.selectedChat = chat;
        });
    }

    if(this.isPrivateChat) {
      this.chatService.selectedPrivateChatMessages.pipe(takeUntil(this.onDestroy))
        .subscribe((messages: any) => this.messages = messages);
    } else {
      this.chatService.selectedChatMessages.pipe(takeUntil(this.onDestroy))
        .subscribe((messages: any) => this.messages = messages);
    }

    this.userService.userInfo$.pipe(takeUntil(this.onDestroy)).subscribe((user: User | null) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }

  ngAfterViewInit() {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
  }
  addEmoji(event:any) {
    const emoji: string = (event.emoji as any).native;
    const input = this.input.nativeElement;
    input.focus();

    if (document.execCommand){

      const e = new Event('input');
      document.execCommand('insertText', false, emoji);
      return;
    }
    const [start, end] = [input.selectionStart, input.selectionEnd];
    input.setRangeText(emoji, start, end, 'end');
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
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

  public sendMessage() {
    if(!this.messageText.length) return;
    this.showEmojiPicker = false;
    this.isPrivateChat ?
      this.chatService.sendPrivateMessage(this.messageText, this.user, this.selectedChat) :
      this.chatService.sendMessage(this.messageText, this.user);
    this.messageText = '';
  }

}
