import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup} from "@angular/forms";
import {User, UsersService} from "../../../../core/services/users.service";

const users = [
  {key: 'IK', value: 'IK'},
  {key: 'AK', value: 'AK'}
]

@Component({
  selector: 'app-add-chat-modal',
  templateUrl: './add-chat-modal.component.html',
  styleUrls: ['./add-chat-modal.component.scss']
})
export class AddChatModalComponent implements OnInit {
  public chatName = '';
  constructor(public dialogRef: MatDialogRef<AddChatModalComponent>) { }

  ngOnInit(): void {
  }

  public createNewChat() {
    if(!this.chatName) return;
    this.dialogRef.close({chatName: this.chatName})
  }

}
