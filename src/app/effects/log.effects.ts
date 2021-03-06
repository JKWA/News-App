import { Injectable, isDevMode } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, map, catchError} from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import * as LogActions from '../actions/log.actions';
import { LogActionTypes } from '../actions/log.actions';
import * as NewsActions from '../actions/news.actions';
import { NewsActionTypes } from '../actions/news.actions';
import { NewsSectionActionTypes } from '../actions/news-section.actions';
import { FilterActionTypes } from '../actions/filter.actions';
import { AppStatusActionTypes } from '../actions/app-status.actions';
import * as fromReducers from './../reducers';
import { Time } from './../shared/utility/time.utility';
import * as ServiceMessage from '../messages/service.messages';


@Injectable()
export class LogEffects {

  @Effect({ dispatch: false })
  consoleLogAllActions$: Observable<Action> = this.actions$.pipe(
      tap(results => {
        if ( isDevMode() ) {
          console.log(results);
        }
      })
  );

  @Effect()
  logActions$: Observable<Action> = this.actions$.pipe(
    ofType<NewsActions.InitiateNews>(
        NewsActionTypes.InitiateNews,
        NewsActionTypes.AddInitialApiArticles,
        NewsActionTypes.InsertAdditionalNewsFromApi,
        NewsActionTypes.AddInitialClientArticles,
        NewsActionTypes.GetExpiredData,
        NewsActionTypes.DeleteExpiredData,
        NewsSectionActionTypes.AddNewsSection,
        NewsSectionActionTypes.RemoveNewsSection,
        NewsSectionActionTypes.SetCurrentlyViewingNewsSection,
        FilterActionTypes.AddFilter,
        FilterActionTypes.RemoveFilter,
        LogActionTypes.DeleteAllLogs,
        AppStatusActionTypes.Online,
        AppStatusActionTypes.Offline
      ),
      map(results => {
      return new LogActions.AddLog({
        time: new Time().logFormat,
        type: results.type
      });
    }),
    catchError(_ => {
      return of( new LogActions.AddLogFailed(new ServiceMessage.SavedIndexedDbMessage().errorMessage));
    })
  );

  @Effect()
  loadLogs$ = this.actions$.pipe(ofType(LogActionTypes.LoadLogs));


  constructor(
    private actions$: Actions,
    private store: Store<fromReducers.State>
  ) {}
}
