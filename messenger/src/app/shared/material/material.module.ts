import {NgModule} from "@angular/core";
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';

const MaterialComponents = [
  MatDialogModule,
  MatTooltipModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule
]
@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
