import { Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  bottomOffset = 1000;
  topOffset = 0;
  online = true;

  constructor(
    public snackBar: MatSnackBar
  ) {}

  @HostListener('window:offline', ['$event'])
  openSnackbar(event) {
    this.snackBar.open('No network detected', '', {
      duration: 0,
    });
  }

  @HostListener('window:online', ['$event'])
  closeSnackbar(event) {
    this.snackBar.dismiss();
  }
}


