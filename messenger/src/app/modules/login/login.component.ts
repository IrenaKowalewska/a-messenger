import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  public async login() {
    try {
      const user: any = await this.authService.login();
      this.authService.userInfo$.next(user?.user?._delegate);
      this.router.navigate(['/chats']);
    } catch (e) {
      console.log(e);
    }
  }
}
