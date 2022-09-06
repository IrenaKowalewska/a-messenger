import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatChatNamePipe } from './format-chat-name.pipe';
import { FilterChatsPipe } from './filter-chats.pipe';



@NgModule({
  declarations: [
    FormatChatNamePipe,
    FilterChatsPipe
  ],
    exports: [
        FormatChatNamePipe,
        FilterChatsPipe
    ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
