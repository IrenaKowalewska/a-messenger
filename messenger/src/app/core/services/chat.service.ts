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
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public chats!: Observable<Chat[]>;
  public privateChats!: Observable<Chat[]>;
  public chatId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public privateChatId: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public selectedChat!: Observable<Chat | undefined>;
  public selectedPrivateChat!: Observable<Chat | undefined>;
  public selectedChatMessages!: Observable<ChatMessage[]>;
  public selectedPrivateChatMessages!: Observable<ChatMessage[]>;
  public get currentUserId() {
    return this.userService.userInfo$.getValue()?.userId;
  }

  constructor(public db: AngularFirestore, private userService: UsersService) {
    this.selectedPrivateChat = this.privateChatId.pipe(
      switchMap((id: string) => {
        return this.db.collection<Chat>(`private-chats/${this.currentUserId}/chats/`).doc(id).valueChanges();
      })
    );
    this.selectedPrivateChatMessages = this.privateChatId.pipe(
      switchMap((id: string) => {
        return this.db.collection<ChatMessage>(`private-chats/${this.currentUserId}/chats/${id}/messages`, ref => {
          return ref.orderBy('timestamp', 'asc').limit(100);
        }).valueChanges();
      })
    );
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
    this.privateChats = this.db.collection<Chat>(`private-chats/${this.currentUserId}/chats`).valueChanges();
  }

  public sendMessage(messageText: string, user: User | null) {
    const chatId = this.chatId.getValue();
    const newMessage = this.createMessage(messageText, user);
    this.db.collection(`chats/${chatId}/messages`).doc(newMessage.id).set(newMessage);
    this.db.collection(`chats`).doc(chatId).update({lastMessage: newMessage.message});
  }

  public sendPrivateMessage(messageText: string, user: User | null, selectedChat: Chat | null) {
    const chatId = this.privateChatId.getValue();
    const newMessage = this.createMessage(messageText, user);
    if(selectedChat?.authorId === selectedChat?.selectedUserId) {
      this.db.collection(`private-chats/${selectedChat?.authorId}/chats/${chatId}/messages`).add(newMessage);
      return;
    }
    this.db.collection(`private-chats/${selectedChat?.selectedUserId}/chats/${chatId}/messages`).add(newMessage);
    this.db.collection(`private-chats/${selectedChat?.authorId}/chats/${chatId}/messages`).add(newMessage);

  }

  public createNewChat(name: string, image: string) {
    const id = this.db.createId();
    this.db.collection(`chats`).doc(id).set(
      {
        id: id,
        name: name,
        authorId: this.currentUserId,
        lastMessage: '',
        image
      },
    );
  }

  public createNewPrivateChat({id, userName}: {id: string; userName: string}) {
    const chatId = this.db.createId();
    this.db.collection('private-chats')
      .doc(this.currentUserId)
      .collection('chats')
      .doc(chatId)
      .set(
      {
        id: chatId,
        name: `Chat ${this.userService.userInfo$.getValue()?.displayName} with ${userName}`,
        authorId: this.currentUserId,
        selectedUserId: id,
      }
    );
    this.db.collection('private-chats')
      .doc(id)
      .collection('chats')
      .doc(chatId)
      .set(
        {
          id: chatId,
          name: `Chat ${this.userService.userInfo$.getValue()?.displayName} with ${userName}`,
          authorId: this.currentUserId,
          selectedUserId: id,
        }
      );
  }

  public deleteChat(id: string) {
    this.db.collection(`chats`).doc(id).delete();
  }

  public deletePrivateChat(id: string, selectedUserId: string | undefined) {
    this.db.collection('private-chats')
      .doc(this.currentUserId)
      .collection('chats')
      .doc(id)
      .delete();
    this.db.collection('private-chats')
      .doc(selectedUserId)
      .collection('chats')
      .doc(id)
      .delete();
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
