import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

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
