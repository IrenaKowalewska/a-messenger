import { Component, Input, OnInit } from '@angular/core';
import { AvatarColourService } from './avatar-colour.service';

@Component({
    selector: 'avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
    @Input() firstName: string | null | undefined;
    @Input() lastName: string | null | undefined;
    @Input() userId: string | null | undefined;
    @Input() isCircle = false;
    @Input() photo?: string;
    @Input() isBase64?: boolean;

    public selectedColor?: String;
    public initials?: string = '';
    public pref = 'data:image/jpeg;base64,';

    constructor(private avatarColourService: AvatarColourService) {}

    public ngOnInit(): void {
        this.selectedColor = this.avatarColourService.getColour(this.userId);
        this.setInitials();
    }

    public onImageLoadError(): void {
      console.log(this.photo)
        this.photo = '';
    }

    private setInitials() {
        this.firstName
            ? (this.initials = this.firstName.slice(0, 1).toUpperCase())
            : (this.initials += 'R');
        this.lastName
            ? (this.initials += this.lastName.slice(0, 1).toUpperCase())
            : (this.initials += '');
    }
}
