import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {BehaviorSubject, Observable} from "rxjs";

export interface User {
  email: string;
  displayName: string;
  userPhoto: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public users!: Observable<User[]>;
  public userInfo$ = new BehaviorSubject<User | null>(null);

  constructor(public db: AngularFirestore) {
    this.users = db.collection<User>('users').valueChanges();
  }

  public setUserData(user: any): void {
    const data: User = {
      email: user.email,
      displayName: user.displayName,
      userPhoto: user.photoURL,
      userId: user.uid,
    };

    this.db.collection('users').doc(user.uid).set(data);
  }
}
