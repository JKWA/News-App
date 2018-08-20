import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Store, select, Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FilterActionTypes } from '../actions/filter.actions';
import * as FilterActions from '../actions/filter.actions';
import * as fromFilter from './../reducers';
import { LocalStorageMessage } from '../messages/service.messages';
import { LocalStorageService } from '../services/local-storage.service';


@Injectable()
export class FilterEffects {

  @Effect()
  setFilters$: Observable<Action> = this.actions$.pipe(
    ofType<FilterActions.AddFilter>(FilterActionTypes.AddFilter, FilterActionTypes.RemoveFilter),
    withLatestFrom(this.store, ( _ , state) => {
      of(state).pipe(
        select(fromFilter.getAllFilters),
        switchMap(results => this.localStorageService.setFilters(results)
          .pipe(
            catchError(() => of(new FilterActions.SavedFilterToClientFailed(new LocalStorageMessage().errorMessage)))
          )
        ),
        // tap(results => {
        //   this.store.dispatch(new LogActions.AddLogFromFilterEffect({location: 'Filter Effect', message: results.statusText}));
        // }),
      ).subscribe();
    }),
    map( () => new FilterActions.SavedFilterToClient(new LocalStorageMessage().successMessage)),
    // catchError(errorMessage =>  of(new FilterActions.SavedFilterToClientFailed(errorMessage)))
  );

  @Effect()
  loadFilters$ = this.actions$.pipe(ofType(FilterActionTypes.LoadFilters));

  constructor(
    private actions$: Actions,
    private store: Store<fromFilter.State>,
    private localStorageService: LocalStorageService
  ) {}
}
