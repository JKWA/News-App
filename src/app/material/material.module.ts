import { NgModule } from '@angular/core';
import {
  MatToolbarModule,
  MatTableModule,
  MatButtonModule,
  MatInputModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatTabsModule,
  MatProgressSpinnerModule} from '@angular/material';

@NgModule({
  exports: [
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
  ]
})
export class MaterialModule { }
