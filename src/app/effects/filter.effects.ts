import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Store, select, Action } from '@ngrx/store';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { FilterActionTypes } from '../actions/filter.actions';
import * as FilterActions from '../actions/filter.actions';
import * as fromFilter from './../reducers';
import { LocalStorageService } from '../services/local-storage.service';
import * as ServiceMessage from '../messages/service.messages';
import { FilterDefault } from '../shared/defaults/filter.default';

@Injectable()
export class FilterEffects {

  @Effect()
  setFilters$: Observable<Action> = this.actions$.pipe(
    ofType<FilterActions.AddFilter | FilterActions.RemoveFilter>(FilterActionTypes.AddFilter, FilterActionTypes.RemoveFilter),
    withLatestFrom(this.store, ( _ , state) => state),
    select(fromFilter.getAllFilters),
    switchMap(filters => {
      return this.localStorageService.setFilters(filters)
      .pipe(
        map(() => new FilterActions.SavedFilterToClient(new ServiceMessage.LocalStorageSetMessage().successMessage)),
        catchError(() => of(new FilterActions.SavedFilterToClientFailed(new ServiceMessage.LocalStorageSetMessage().errorMessage)))
      );
    })
  );

  @Effect()
  loadInitialFilters$: Observable<Action> = this.actions$.pipe(
    ofType(FilterActionTypes.InitFilters),
    switchMap(_ => this.localStorageService.getFilters()),
    map(filters => new FilterActions.LoadFilters(filters)),
    catchError(_ => of(new FilterActions.LoadFiltersFailed(new FilterDefault().getDefaultFilters)))
  );


  @Effect()
  init$: Observable<Action> = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(_ => new FilterActions.InitFilters())
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromFilter.State>,
    private localStorageService: LocalStorageService
  ) { }

}
