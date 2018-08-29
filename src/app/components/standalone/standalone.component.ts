import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap, take, withLatestFrom } from 'rxjs/operators';
import { NewsSection } from '../../enums/news-section.enum';
import { Store, select } from '@ngrx/store';
import * as fromNews from './../../reducers';
import * as fromFilters from './../../reducers';
import * as fromNewsSection from './../../reducers';
import * as fromAppStatus from './../../reducers';
import { Device } from './../../enums/device.enum';

@Component({
  selector: 'app-standalone',
  templateUrl: './standalone.component.html',
  styleUrls: ['./standalone.component.css']
})
export class StandaloneComponent {

  constructor(
    private store: Store<fromNews.State>
  ) { }

/**
 * test if Apple moble device
 *
 * @readonly
 * @type {boolean}
 * @memberof StandaloneComponent
 */
get isApple(): Observable<boolean> {
    return this.store.pipe(
      select(fromAppStatus.getDeviceState),
      take(1),
      map(device => device === Device.Iphone)
    );
  }

/**
 * tests if Android device
 *
 * @readonly
 * @type {boolean}
 * @memberof StandaloneComponent
 */
get isAndroid(): Observable<boolean> {
    return this.store.pipe(
      select(fromAppStatus.getDeviceState),
      take(1),
      map(device => device === Device.Android)
    );
  }

}
