import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";
import {ChatService} from "./chat.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public auth: AngularFireAuth, private router: Router) { }

  public login() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  public logout() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }

  public getUser(): Observable<any> {
    return this.auth.authState;
  }
}
