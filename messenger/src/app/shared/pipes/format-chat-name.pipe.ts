import { Pipe, PipeTransform } from '@angular/core';
import {Chat} from "../../core/services/chat.service";

@Pipe({
  name: 'formatChatName'
})
export class FormatChatNamePipe implements PipeTransform {

  transform(value: string | undefined, chat: Chat | null, isMessageTitle: boolean, userId: string | undefined): string {
    if(!chat) return '';

    if(chat?.chatType === 'All') {
      return chat?.name;
    }

    if(isMessageTitle) {
      return `${chat?.selectedUserName} - ${chat?.name}`;
    } else {
      return chat?.authorId === userId ? `${chat?.selectedUserName}` : `${chat?.name}`;
    }
  }
}
