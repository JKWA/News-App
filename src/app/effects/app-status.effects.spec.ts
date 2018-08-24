import { TestBed } from '@angular/core/testing';
import { Observable, empty } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { AppStatusEffects } from './app-status.effects';
import * as fromAppStatus from '../reducers';
import * as AppStatusActions from '../actions/app-status.actions';
import { ServiceMessageModel } from '../models/service-message.model';
import * as ServiceMessage from '../messages/service.messages';
import { AppStatusService } from '../services/app-status.service';
import { Device } from '../enums/device.enum';
import {
  MatSnackBarModule
  } from '@angular/material';

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

class MockStorageService {
  getOnlineStatus = jasmine.createSpy('getOnlineStatus');
  getMobileStatus = jasmine.createSpy('getMobileStatus');
  getStandaloneStatus = jasmine.createSpy('getStandaloneStatus');
  getDevice = jasmine.createSpy('getDevice');
}

describe('AppStatusEffects', () => {
  let effects: AppStatusEffects;
  let actions$: TestActions;
  let appStatusService: MockStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppStatusEffects,
        provideMockActions(() => actions$),
        { provide: AppStatusService, useClass: MockStorageService },
        { provide: Actions, useFactory: getActions },
      ],
      imports: [
        MatSnackBarModule,
        StoreModule.forRoot({...fromAppStatus.reducers}),
      ],
    });

  effects = TestBed.get(AppStatusEffects);
  appStatusService = TestBed.get(AppStatusService);
  actions$ = TestBed.get(Actions);
  });

  it('App Effect should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('"LoadAppStatus" should return a Offline, on success', () => {
    const action = new AppStatusActions.LoadAppStatus();
    const completion = new AppStatusActions.Offline();

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: false});
    const expected = cold('--c', { c: completion });
    appStatusService.getOnlineStatus.and.returnValue(response);
    expect(effects.loadCurrentOnline$).toBeObservable(expected);
  });

  it('"LoadAppStatus" should return a SetDevice, with Device, on success', () => {
    const action = new AppStatusActions.LoadAppStatus();
    const completion = new AppStatusActions.SetDevice(Device.Iphone);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: Device.Iphone});
    const expected = cold('--c', { c: completion });
    appStatusService.getDevice.and.returnValue(response);
    expect(effects.loadCurrentDevice$).toBeObservable(expected);
  });

  it('"LoadAppStatus" should return a SetStandalone, with value, on success', () => {
    const action = new AppStatusActions.LoadAppStatus();
    const completion = new AppStatusActions.SetStandalone(false);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: false});
    const expected = cold('--c', { c: completion });
    appStatusService.getStandaloneStatus.and.returnValue(response);
    expect(effects.loadCurrentStandalone$).toBeObservable(expected);
  });

  // it('"LoadAppStatus" should return a SetDevice, with Device, on success', () => {
  //   const serviceMessage: ServiceMessageModel = new ServiceMessage.CurrentAppStatus().errorMessage;
  //   const action = new AppStatusActions.LoadAppStatus();
  //   const completion = new AppStatusActions.SetStandalone(false);

  //   actions$.stream = hot('-a', { a: action });
  //   const response = cold('-#|', { b: serviceMessage});
  //   const expected = cold('--c', { c: completion });
  //   appStatusService.getStandaloneStatus.and.returnValue(response);
  //   expect(effects.loadCurrentStandalone$).toBeObservable(expected);
  // });



});
