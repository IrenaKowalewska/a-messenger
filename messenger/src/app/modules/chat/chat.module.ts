import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import {MaterialModule} from "../../core/material/material.module";
import { AddChatModalComponent } from './components/add-chat-modal/add-chat-modal.component';
import {SpinnerModule} from "../../shared/spinner/spinner.module";
import { ChatsListComponent } from './components/chats-list/chats-list.component';
import { ChatListItemComponent } from './components/chat-list-item/chat-list-item.component';
import { ChatUsersListComponent } from './components/chat-users-list/chat-users-list.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: ChatComponent},
  {path: ':id', component: ChatComponent},
];

@NgModule({
  declarations: [
    ChatComponent,
    ChatMessageComponent,
    ChatRoomComponent,
    AddChatModalComponent,
    ChatsListComponent,
    ChatListItemComponent,
    ChatUsersListComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        PickerModule,
        EmojiModule,
        MaterialModule,
        SpinnerModule
    ]
})
export class ChatModule { }
