import { Component, OnInit, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(
    public snackBar: MatSnackBar,
  ) { }

  @HostListener('window:offline', ['$event'])
  openSnackbar(_) {
    this.snackBar.open('No network detected', '', {
      duration: 0,
    });
  }

  @HostListener('window:online', ['$event'])
  closeSnackbar(_) {
    this.snackBar.dismiss();
  }
}

