import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {WebSocketService} from "../../../../core/services/web-socket.service";
import {AuthService} from "../../../../core/services/auth.service";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {
  public messages: any = [];
  public messageText = '';
  public user!: any;
  @ViewChild('scrollframe', {static: false}) scrollFrame!: ElementRef;
  @ViewChild('input', {static: false}) input!: ElementRef;
  @ViewChildren('chatItem') itemElements!: QueryList<any>;
  private scrollContainer: any;
  private isNearBottom = true;
  public showEmojiPicker = false;

  constructor(private webSocketService: WebSocketService, private authService: AuthService) { }

  ngOnInit(): void {
    this.webSocketService.openWebSocket();
    this.webSocketService.chatMessages.subscribe((message: any) => {
      if(message.message) {
        this.messages = [...this.messages, message];
      }
    });

    this.authService.userInfo$.subscribe(user => {
      this.user = user;
    })
  }

  ngOnDestroy() {
    this.webSocketService.chatMessages.next([]);
    this.webSocketService.closeWebSocket();
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
    const newMessage = {
      message: this.messageText,
      author: this.user.displayName,
      authorPhoto: this.user.photoURL,
      authorId: this.user.uid,
      timestamp: new Date().toISOString()
    };

    this.messageText = '';
    this.messages = [...this.messages, newMessage];
    this.webSocketService.sendMessage({message: newMessage});
  }

}
