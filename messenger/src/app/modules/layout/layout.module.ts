import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import {AvatarModule} from "../../shared/avatar/avatar.module";



@NgModule({
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent,
  ],
    imports: [
        CommonModule,
        AvatarModule
    ]
})
export class LayoutModule { }
