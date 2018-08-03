import { Component } from '@angular/core';

@Component({
  selector: 'app-standalone',
  templateUrl: './standalone.component.html',
  styleUrls: ['./standalone.component.css']
})
export class StandaloneComponent {

  constructor() { }

  get isApple() {
    return /iphone|ipad|ipod/.test( navigator.userAgent.toLowerCase() );
  }

  get isAndroid() {
    return /android/.test( navigator.userAgent.toLowerCase() );
  }

}
