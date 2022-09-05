import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, switchMap} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User, UsersService} from "./users.service";

export interface ChatMessage {
  message: string;
  id: string;
  author: string;
  authorPhoto: string;
  authorId: string;
  timestamp: string;
}

export interface Chat {
  name: string;
  id: string;
  authorId?: string;
  selectedUserId?: string;
  lastMessage: string;
  image: string;
  chatType: string;
  selectedUserName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chats!: Observable<Chat[]>;
  public chatId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedChat!: Observable<Chat | undefined>;
  public selectedChatMessages!: Observable<ChatMessage[]>;
  public get currentUserId() {
    return this.userService.userInfo$.getValue()?.userId;
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
          return ref.orderBy('timestamp', 'asc').limit(100);
        }).valueChanges();
      })
    );
    this.chats = this.db.collection<Chat>('chats').valueChanges();
  }

  public sendMessage(messageText: string, user: User | null) {
    const chatId = this.chatId.getValue();
    const newMessage = this.createMessage(messageText, user);
    this.db.collection(`chats/${chatId}/messages`).doc(newMessage.id).set(newMessage);
    this.db.collection(`chats`).doc(chatId).update({lastMessage: newMessage.message});
  }

  public createNewChat(name: string, image: string, chatType: string, selectedUserName: string) {
    const id = this.db.createId();
    const chatName = chatType === 'All' ? name : this.userService.userInfo$.getValue()?.displayName;
    this.db.collection(`chats`).doc(id).set(
      {
        id: id,
        name: chatName,
        authorId: this.currentUserId,
        lastMessage: '',
        image,
        chatType,
        selectedUserId: chatType,
        selectedUserName
      },
    );
  }

  public deleteChat(id: string) {
    this.db.collection(`chats`).doc(id).delete();
  }

  private createMessage(messageText: string, user: User | null) {
    const id = this.db.createId();
    return {
      message: messageText,
      id: id,
      author: user?.displayName,
      authorPhoto: user?.userPhoto,
      authorId: user?.userId,
      timestamp: new Date().toISOString()
    };
  }
}
