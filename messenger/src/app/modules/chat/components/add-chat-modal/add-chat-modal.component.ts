import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User, UsersService} from "../../../../core/services/users.service";
import {ChatType} from "../../chat.component";

interface AddChatForm {
  chatName: FormControl;
  chatImage: FormControl;
  chatType: FormControl;
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
  public possibleValues: {key: string; value: string}[] = [{key: 'All', value: 'All'}];

  constructor(public dialogRef: MatDialogRef<AddChatModalComponent>, private usersService: UsersService) { }

  ngOnInit(): void {
    this.form = new FormGroup<AddChatForm>({
      chatName: new FormControl('', Validators.required),
      chatImage: new FormControl(''),
      chatType: new FormControl(ChatType.Group),
    });

    this.usersService.users.subscribe(users => {
      const selectValues = users.map((user: User) => ({key: user.userId, value: user.displayName}));
      this.possibleValues = [...this.possibleValues, ...selectValues];

    })
  }

  public createNewChat() {
    if(!this.form.controls['chatName'].value) return;
    const user = this.possibleValues.find(user => user.key === this.form.controls['chatType'].value);
    const chatType = this.form.controls['chatType'].value === ChatType.Group ? ChatType.Group : ChatType.Private;
    this.dialogRef.close({
      chatName: this.form.controls['chatName'].value,
      chatImage: this.form.controls['chatImage'].value,
      chatType,
      selectedUserName: user?.value || '',
      selectedUserId: user?.key || ''
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

  public change(event: any) {
    if(event.value !== ChatType.Private) {
      const user = this.possibleValues.find(user => user.key === event.value);
      this.form.controls['chatName'].setValue(`Chat with ${user?.value}`);
    }
    this.form.patchValue({
      chatType: event.value,
    });
  }
}
