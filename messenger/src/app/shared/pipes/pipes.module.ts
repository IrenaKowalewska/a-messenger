import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatChatNamePipe } from './format-chat-name.pipe';



@NgModule({
  declarations: [
    FormatChatNamePipe
  ],
  exports: [
    FormatChatNamePipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
