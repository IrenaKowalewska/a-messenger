import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {RouterModule, Routes} from "@angular/router";
import {FormsModule} from "@angular/forms";
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import {PickerModule} from "@ctrl/ngx-emoji-mart";
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', component: ChatComponent},
  {path: 'chat/:id', component: ChatRoomComponent},

];

@NgModule({
  declarations: [
    ChatComponent,
    ChatMessageComponent,
    ChatRoomComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    PickerModule,
    EmojiModule
  ]
})
export class ChatModule { }
