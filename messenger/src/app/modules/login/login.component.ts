import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ChatService} from "../../core/services/chat.service";
import {User, UsersService} from "../../core/services/users.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private userService: UsersService) { }

  ngOnInit(): void {
  }

  public async login() {
    try {
      const user: any = await this.authService.login();
      const newUser: User = {
        email: user.email,
        displayName: user.displayName,
        userPhoto: user.photoURL,
        userId: user.uid,
      };
      this.userService.userInfo$.next(newUser);
      this.userService.setUserData(user?.user?._delegate);
      this.router.navigate(['/chats']);
    } catch (e) {
      console.log(e);
    }
  }
}
