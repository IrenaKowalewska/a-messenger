import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../shared/services/auth.service";
import {Subject, takeUntil} from "rxjs";
import {ChatService} from "../../../shared/services/chat.service";
import {UsersService} from "../../../shared/services/users.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public user!: any;
  public onDestroy$ = new Subject<boolean>();

  constructor(private authService: AuthService, private userService: UsersService) {}

  ngOnInit(): void {
    this.userService.userInfo$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  public logOut() {
    this.authService.logout();
    this.user = null;
  }

}
