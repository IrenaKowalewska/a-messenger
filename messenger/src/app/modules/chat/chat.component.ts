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
import {WebSocketService} from "../../core/services/web-socket.service";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewInit {
  public messages: any = [];
  public messageText = '';
  public user!: any;
  @ViewChild('scrollframe', {static: false}) scrollFrame!: ElementRef;
  @ViewChildren('chatItem') itemElements!: QueryList<any>;
  private itemContainer: any;
  private scrollContainer: any;
  private isNearBottom = true;

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
