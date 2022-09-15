import { NgModule } from '@angular/core';
import {AngularFireModule} from "@angular/fire/compat";
import {environment} from "../../environments/environment";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";



@NgModule({
  declarations: [],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ]
})
export class CoreModule { }
