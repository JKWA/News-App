import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material';
import { AppComponent } from '../app.component';
import { AppStatusActionTypes } from '../actions/app-status.actions';
import * as AppStatusActions from '../actions/app-status.actions';
import { AppStatusService } from '../services/app-status.service';
import * as ServiceMessage from '../messages/service.messages';

@Injectable()
export class AppStatusEffects {

  @Effect()
  loadCurrentOnline$: Observable<Action> = this.actions$.pipe(
    ofType<AppStatusActions.LoadAppStatus>(AppStatusActionTypes.LoadAppStatus),
    switchMap(_ => this.appStatusService.getOnlineStatus()
      .pipe(
        map(online => {
          return online
            ? new AppStatusActions.Online()
            : new AppStatusActions.Offline();
        }),
        catchError(() => of(new AppStatusActions.SetAppStatusFailed(new ServiceMessage.CurrentAppStatus().errorMessage)))
      )
    )
  );

  @Effect()
  loadCurrentDevice$: Observable<Action> = this.actions$.pipe(
    ofType<AppStatusActions.LoadAppStatus>(AppStatusActionTypes.LoadAppStatus),
    switchMap(_ => this.appStatusService.getDevice()
      .pipe(
        map(device => new AppStatusActions.SetDevice(device)),
        catchError(() => of(new AppStatusActions.SetAppStatusFailed(new ServiceMessage.CurrentAppStatus().errorMessage)))
      )
    )
  );

  @Effect()
  loadCurrentStandalone$: Observable<Action> = this.actions$.pipe(
    ofType<AppStatusActions.LoadAppStatus>(AppStatusActionTypes.LoadAppStatus),
    switchMap(_ => this.appStatusService.getStandaloneStatus()
      .pipe(
        map(standalone => new AppStatusActions.SetStandalone(standalone)),
        catchError(() => of(new AppStatusActions.SetAppStatusFailed(new ServiceMessage.CurrentAppStatus().errorMessage)))
      )
    )
  );

  @Effect({ dispatch: false })
  offline$ = this.actions$.pipe(
    ofType<AppStatusActions.Offline>(AppStatusActionTypes.Offline),
    tap(console.log),
    tap(_ => {
      this.snackBar.open('No network detected', '', {
          duration: 0,
        });
    })
  );

  @Effect({ dispatch: false })
  online$ = this.actions$.pipe(
    ofType<AppStatusActions.Online>(AppStatusActionTypes.Online),
    tap(console.log),
    tap(_ => {
      this.snackBar.dismiss();
    })
  );

  constructor(
    private actions$: Actions,
    private appStatusService: AppStatusService,
    public snackBar: MatSnackBar,

  ) {}
}
