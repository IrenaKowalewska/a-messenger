import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import {MaterialModule} from "../../shared/material/material.module";
import { AddChatModalComponent } from './components/add-chat-modal/add-chat-modal.component';
import {SpinnerModule} from "../../shared/spinner/spinner.module";
import { ChatsListComponent } from './components/chats-list/chats-list.component';
import { ChatListItemComponent } from './components/chat-list-item/chat-list-item.component';
import {ChatsResolver} from "./resolvers/chats.resolver";
import {AvatarModule} from "../../shared/avatar/avatar.module";
import {PipesModule} from "../../shared/pipes/pipes.module";
import {SelectedChatResolver} from "./resolvers/selected-chat.resolver";
import { ChatMessageInputComponent } from './components/chat-message-input/chat-message-input.component';
import { ChatListTabComponent } from './components/chat-list-tab/chat-list-tab.component';
import {ChatRoomStartComponent} from "./chat-room-start/chat-room-start.component";

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    resolve: {chats: ChatsResolver, selectedChat: SelectedChatResolver},
    children: [
      {
        path: '',
        component: ChatRoomStartComponent,
        pathMatch: 'full',
      },
      {
        path: ':id',
        component: ChatRoomComponent,
      },
    ]
  },
];

@NgModule({
  declarations: [
    ChatComponent,
    ChatMessageComponent,
    ChatRoomComponent,
    AddChatModalComponent,
    ChatsListComponent,
    ChatListItemComponent,
    ChatMessageInputComponent,
    ChatListTabComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PickerModule,
    EmojiModule,
    MaterialModule,
    SpinnerModule,
    AvatarModule,
    ReactiveFormsModule,
    PipesModule
  ]
})
export class ChatModule { }
