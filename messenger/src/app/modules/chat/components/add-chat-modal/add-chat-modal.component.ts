import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User, UsersService} from "../../../../core/services/users.service";
import {AddChatModalData, ChatType} from "../../chat.component";
import {Chat} from "../../../../core/services/chat.service";

interface AddChatForm {
  chatName: FormControl;
  chatImage: FormControl;
  chatType: FormControl;
}

interface DialogData {
  isEdit: boolean;
  chat?: Chat;
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
  public chatTypes = ChatType;
  public possibleValues: {key: string; value: string}[] = [{key: 'All', value: 'All'}];
  public users: User[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddChatModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.form = new FormGroup<AddChatForm>({
      chatName: new FormControl(this.data.chat?.name || '', Validators.required),
      chatImage: new FormControl(this.data.chat?.image || ''),
      chatType: new FormControl(this.data.chat?.chatType || ChatType.Group),
    });

    this.usersService.users.subscribe(users => {
      const selectValues = users.map((user: User) => ({key: user.userId, value: user.displayName}));
      this.possibleValues = [...this.possibleValues, ...selectValues];
      this.users = users;
    });
  }

  public createNewChat(): void {
    if(!this.form.controls['chatName'].value) return;
    const user = this.users.find(user => user.userId === this.form.controls['chatType'].value);
    const chatType = this.form.controls['chatType'].value === ChatType.Group ? ChatType.Group : ChatType.Private;
    const chatData = this.createNewChatData(user, chatType);
    this.dialogRef.close(chatData);
  }

  public async changeImgInput(event: Event): Promise<void> {
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

  public change(event: any): void {
    if(event.value !== ChatType.Private) {
      const user = this.possibleValues.find(user => user.key === event.value);
      this.form.controls['chatName'].setValue(`Chat with ${user?.value}`);
    }
    this.form.patchValue({
      chatType: event.value,
    });
  }

  private createNewChatData(user: User | undefined, chatType: string): AddChatModalData {
    return {
      chatName: this.form.controls['chatName'].value,
      chatImage: this.form.controls['chatImage'].value,
      chatType,
      selectedUserName: user?.displayName || '',
      selectedUserId: user?.userId || '',
      selectedUserPhoto: user?.userPhoto || '',
      id: this.data.chat?.id || '',
      authorId: this.data.chat?.authorId || '',
      lastMessage: this.data.chat?.lastMessage || ''
    }
  }
}
