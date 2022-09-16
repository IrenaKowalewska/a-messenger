import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from "./shared/guards/auth.guard";

const routes: Routes = [
  {path: '', redirectTo: 'chats', pathMatch:'full'},
  {
    path: 'chats',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/chat/chat.module').then((m) => m.ChatModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
