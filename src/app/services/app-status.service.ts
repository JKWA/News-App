import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter } from '../models/filter';
import { Category } from '../enums/category.enum';
import { ServiceMessageModel } from '../models/service-message.model';
import * as ServiceMessage from '../messages/service.messages';
import { Device } from '../enums/device.enum';
@Injectable({
  providedIn: 'root'
})
export class AppStatusService {

  constructor() { }

  private get isApple(): boolean {
    return /iphone|ipad|ipod/.test( navigator.userAgent.toLowerCase() );
  }

  private get isAndroid(): boolean {
    return /android/.test( navigator.userAgent.toLowerCase() );
  }

  private get isStandalone(): boolean {
    // @ts-ignore
    return ('standalone' in navigator) && (navigator.standalone) || window.matchMedia('(display-mode: standalone)').matches;
  }

  getOnlineStatus(): Observable<any> {
     return  new Observable(observer => {
      const navigator = window.navigator;
      if ( ! navigator ) {
        return observer.error(new ServiceMessage.CurrentAppStatus().errorMessage);
      }
      return observer.next(navigator.onLine);
    });
  }


  getDevice(): Observable<any> {
    return  new Observable(observer => {
    const navigator = window.navigator;
    if ( ! navigator ) {
      return observer.error(new ServiceMessage.CurrentAppStatus().errorMessage);
    }
    const device = this.isApple ? Device.Iphone : this.isAndroid ? Device.Android : Device.Computer;
    return observer.next(device);
  });
  }

  getStandaloneStatus(): Observable<any> {
    return  new Observable(observer => {
    const navigator = window.navigator;
    if ( ! navigator ) {
      return observer.error(new ServiceMessage.CurrentAppStatus().errorMessage);
    }
    return observer.next(this.isStandalone);
  });
  }

}


