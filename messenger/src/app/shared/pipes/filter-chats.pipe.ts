import { Pipe, PipeTransform } from '@angular/core';
import {Chat} from "../services/chat.service";
import {ChatType} from "../../modules/chat/chat.component";

@Pipe({
  name: 'filterChats'
})
export class FilterChatsPipe implements PipeTransform {

  transform(chats: Chat[], filterType: string | undefined, userId: string | undefined): Chat[] {
    if(filterType === ChatType.Group) {
      return chats.filter(chat => chat.chatType === ChatType.Group);
    }

    if(filterType === ChatType.Private) {
      return  chats.filter(chat => {
        return chat.chatType === ChatType.Private && (chat.authorId == userId || chat.selectedUserId === userId);
      });
    }
    return [];
  }

}
