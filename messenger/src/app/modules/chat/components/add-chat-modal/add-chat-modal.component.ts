import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

interface AddChatForm {
  chatName: FormControl;
  chatImage: FormControl;
}

@Component({
  selector: 'app-add-chat-modal',
  templateUrl: './add-chat-modal.component.html',
  styleUrls: ['./add-chat-modal.component.scss']
})
export class AddChatModalComponent implements OnInit {
  public form!: FormGroup;
  public pref = 'data:image/jpeg;base64,'
  public addPhotoText = 'Add cover';

  constructor(public dialogRef: MatDialogRef<AddChatModalComponent>) { }

  ngOnInit(): void {
    this.form = new FormGroup<AddChatForm>({
      chatName: new FormControl('', Validators.required),
      chatImage: new FormControl('')
    });
  }

  public createNewChat() {
    if(!this.form.controls['chatName'].value) return;
    this.dialogRef.close({
      chatName: this.form.controls['chatName'].value,
      chatImage: this.form.controls['chatImage'].value
    });
  }

  public async changeImgInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const reader = new FileReader();
    if (target.files) {
      const file = target.files[0];
      const imgSize = file.size;

      reader.readAsBinaryString(file);
      reader.addEventListener('load', (event: any) => {
        if(imgSize < 1048487) {
          const img = btoa(event.target.result);
          this.form.controls['chatImage'].setValue(img);
          this.addPhotoText = 'Add cover';
        } else {
          this.addPhotoText = 'Please upload photo less than 1048kb';
        }

      });
    }
  }

  public removeImg(): void {
    this.form.controls['chatImage'].setValue('');
  }
}
