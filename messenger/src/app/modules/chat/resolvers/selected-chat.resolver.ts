import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Chat} from "../../../shared/services/chat.service";

@Injectable({
  providedIn: 'root'
})
export class SelectedChatResolver implements Resolve<Chat | undefined> {
  constructor(public db: AngularFirestore) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Chat | undefined> {
    return this.db.collection<Chat>('chats').doc(route.params['id']).valueChanges();
  }
}
