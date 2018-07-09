import { Component, OnInit } from '@angular/core';
import { ScrollEvent } from 'ngx-scroll-event';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  bottomOffset = 1000;
  topOffset = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}


  ngOnInit() {  }

  public handleScroll(event: ScrollEvent) {
    const state = this.router.routerState;
    if (event.isReachingBottom) {
      console.log(state.snapshot.root.firstChild.params.id);
    }
  }

}


