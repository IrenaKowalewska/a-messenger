import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, switchMap, tap} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {User, UsersService} from "./users.service";
import {AddChatModalData, ChatType} from "../../modules/chat/chat.component";

export interface ChatMessage {
  message: string;
  id: string;
  author: string;
  authorPhoto: string;
  authorId: string;
  timestamp: string;
  chatId: string;
  edited?: boolean;
}

export interface Chat {
  name: string;
  id: string;
  authorId?: string;
  selectedUserId?: string;
  lastMessage: string;
  lastMessageId?: string;
  image: string;
  chatType: ChatType;
  selectedUserName: string;
  selectedUserPhoto?: string;
  authorPhoto?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chats!: Observable<Chat[]>;
  public chatId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedChat!: Observable<Chat | undefined>;
  public selectedChatMessages!: Observable<ChatMessage[]>;
  public get currentUser() {
    return this.userService.userInfo$.getValue();
  }

  constructor(public db: AngularFirestore, private userService: UsersService) {
    this.selectedChat = this.chatId.pipe(
      switchMap((id: string) => {
        return this.db.doc<Chat>(`chats/${id}`).valueChanges();
      })
    );
    this.selectedChatMessages = this.chatId.pipe(
      switchMap((id: string) => {
        return this.db.collection<ChatMessage>(`chats/${id}/messages`, ref => {
          return ref.orderBy('timestamp', 'asc');
        }).valueChanges();
      })
    );
    this.chats = this.db.collection<Chat>('chats').valueChanges();
  }

  public sendMessage(messageText: string) {
    const chatId = this.chatId.getValue();
    const newMessage = this.createMessage(messageText, chatId);
    this.db.collection(`chats/${chatId}/messages`).doc(newMessage.id).set(newMessage);
    this.db.collection(`chats`).doc(chatId).update({lastMessage: newMessage.message});
  }

  public updateMessage(message: ChatMessage, lastMessage: string) {
    const chatId = this.chatId.getValue();
    this.db.collection(`chats/${chatId}/messages`).doc(message.id).update({
      edited: true,
      message: message.message
    });
    this.db.collection(`chats`).doc(chatId).update({lastMessage: lastMessage});
  }

  public createNewChat(chat: AddChatModalData) {
    const id = this.db.createId();
    const chatName = chat.chatType === ChatType.Group ? chat.chatName : this.userService.userInfo$.getValue()?.displayName;
    this.db.collection(`chats`).doc(id).set(
      {
        id: id,
        name: chatName,
        authorId: this.currentUser?.userId,
        authorPhoto: this.currentUser?.userPhoto || '',
        lastMessage: '',
        image: chat.chatImage,
        chatType: chat.chatType,
        selectedUserId: chat.selectedUserId,
        selectedUserName: chat.selectedUserName,
        selectedUserPhoto: chat.selectedUserPhoto
      },
    );
  }

  public deleteChat(id: string) {
    this.db.collection('chats').doc(id).delete();
  }

  public updateChat(chat: AddChatModalData) {
    this.db.collection('chats').doc(chat.id).update({
      id: chat.id,
      name: chat.chatName,
      authorId: chat.authorId,
      lastMessage: chat.lastMessage,
      image: chat.chatImage,
      chatType: chat.chatType,
    });
  }

  public deleteMessage(id: string, lastMessage: string) {
    const chatId = this.chatId.getValue();
    this.db.collection('chats')
      .doc(chatId)
      .collection('messages')
      .doc(id)
      .delete();

    this.db.collection(`chats`)
      .doc(chatId)
      .update({lastMessage});
  }

  private createMessage(messageText: string, chatId: string) {
    const id = this.db.createId();
    return {
      message: messageText,
      id,
      chatId,
      author: this.currentUser?.displayName,
      authorPhoto: this.currentUser?.userPhoto,
      authorId: this.currentUser?.userId,
      timestamp: new Date().toISOString()
    };
  }
}
