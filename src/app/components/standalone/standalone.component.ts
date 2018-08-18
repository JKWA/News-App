import { Component } from '@angular/core';

@Component({
  selector: 'app-standalone',
  templateUrl: './standalone.component.html',
  styleUrls: ['./standalone.component.css']
})
export class StandaloneComponent {

  constructor() { }

/**
 * test if Apple moble device
 *
 * @readonly
 * @type {boolean}
 * @memberof StandaloneComponent
 */
get isApple(): boolean {
    return /iphone|ipad|ipod/.test( navigator.userAgent.toLowerCase() );
  }

/**
 * tests if Android device
 *
 * @readonly
 * @type {boolean}
 * @memberof StandaloneComponent
 */
get isAndroid(): boolean {
    return /android/.test( navigator.userAgent.toLowerCase() );
  }

}
