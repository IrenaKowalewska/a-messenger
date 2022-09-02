import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable, take, tap} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {User, UsersService} from "../services/users.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private usersService: UsersService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getUser()
      .pipe(
        take(1),
        tap(user => {
          if(!user) {
            this.router.navigate(['/login']);
          } else {
            const userInfo: User = {
              email: user?._delegate.email,
              displayName: user?._delegate.displayName,
              userPhoto: user?._delegate.photoURL,
              userId: user?._delegate.uid,
            };
            this.usersService.userInfo$.next(userInfo);
          }
        }),
        map((user) => !!user)
      )
  }

}
