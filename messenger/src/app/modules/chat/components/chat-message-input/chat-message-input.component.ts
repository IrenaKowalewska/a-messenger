import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-chat-message-input',
  templateUrl: './chat-message-input.component.html',
  styleUrls: ['./chat-message-input.component.scss']
})
export class ChatMessageInputComponent {
  @Input() messageText = '';
  @ViewChild('input', {static: false}) input!: ElementRef;
  @Output() onSendMessage = new EventEmitter<string>();
  public showEmojiPicker = false;

  public sendMessage(): void {
    this.onSendMessage.emit(this.messageText);
    this.showEmojiPicker = false;
    this.messageText = '';
  }

  addEmoji(event:any): void {
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

}
