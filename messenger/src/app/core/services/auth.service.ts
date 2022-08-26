import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import firebase from 'firebase/compat/app';
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userInfo$ = new BehaviorSubject({});

  constructor(public auth: AngularFireAuth, private router: Router) { }

  login() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.auth.signOut();
    localStorage.removeItem('chat-user');
    this.router.navigate(['/login']);
  }

  getUser(): Observable<any> {
    return this.auth.authState;
  }
}
