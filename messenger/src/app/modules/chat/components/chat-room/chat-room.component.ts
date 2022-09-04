import {
  AfterContentChecked, AfterViewChecked,
  AfterViewInit, ChangeDetectorRef,
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
import {Subject, take, takeUntil} from "rxjs";
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
  public isSelectedChat = false;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsersService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if(params['id']) {
        this.chatService.chatId.next(params['id']);
        this.isSelectedChat = true;
      }
    });

    this.chatService.selectedChat.pipe(takeUntil(this.onDestroy))
      .subscribe((chat: Chat | undefined) => {
        if(!chat) {
          this.router.navigate(['/chats']);
          return;
        }
        this.selectedChat = chat;
      });

    this.chatService.selectedChatMessages.pipe(takeUntil(this.onDestroy))
      .subscribe((messages: any) => this.messages = messages);

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
    this.itemElements.changes.pipe().subscribe(_ => this.onItemElementsChanged());
  }

  private onItemElementsChanged(): void {
    if (this.isNearBottom) {
      this.scrollToBottom();
    }
  }

  trackBy(index: number, item: ChatMessage) {
    return item.id;
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      // behavior: 'smooth'
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

  public sendMessage() {
    if(!this.messageText.length) return;
    this.showEmojiPicker = false;
    this.isPrivateChat ?
      this.chatService.sendPrivateMessage(this.messageText, this.user, this.selectedChat) :
      this.chatService.sendMessage(this.messageText, this.user);
    this.messageText = '';
  }

}
