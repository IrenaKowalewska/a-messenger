import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable} from 'rxjs';
import {Chat} from "../../../core/services/chat.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable({
  providedIn: 'root'
})
export class ChatsResolver implements Resolve<Chat[]> {
  constructor(public db: AngularFirestore) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Chat[]> {
    return this.db.collection<Chat>('chats').valueChanges();
  }
}
