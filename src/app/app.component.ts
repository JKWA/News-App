import { Component, OnInit, HostListener } from '@angular/core';
import { ScrollEvent } from 'ngx-scroll-event';
import { ActivatedRoute, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  bottomOffset = 1000;
  topOffset = 0;
  online = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  ngOnInit() { }

  public handleScroll(event: ScrollEvent) {
    const state = this.router.routerState;
    if (event.isReachingBottom) {
      console.log(state.snapshot.root.firstChild.params.id);
    }
  }

}


