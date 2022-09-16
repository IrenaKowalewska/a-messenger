import { Pipe, PipeTransform } from '@angular/core';
import {Chat} from "../services/chat.service";

@Pipe({
  name: 'formatChatName'
})
export class FormatChatNamePipe implements PipeTransform {

  transform(value: string | undefined, chat: Chat | null, isMessageTitle: boolean, userId: string | undefined): string {
    if(!chat) return '';

    if(chat.chatType === 'All') {
      return chat.name.substring(0, 1).toUpperCase() + chat.name.substring(1);
    }

    if(isMessageTitle) {
      return `${chat.selectedUserName} - ${chat.name}`;
    } else {
      return chat.authorId === userId ? `${chat.selectedUserName}` : `${chat.name}`;
    }
  }
}
