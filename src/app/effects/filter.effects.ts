import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { FilterActionTypes } from '../actions/filter.actions';
import { Action } from '@ngrx/store';
import { Observable, defer, of } from 'rxjs';
import { LocalStorageService } from '../service/local-storage.service';
import { tap, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import * as FilterActions from '../actions/category.actions';
import { Store, select } from '@ngrx/store';
import * as fromFilter from './../reducers';
import * as LogActions from '../actions/log.actions';


@Injectable()
export class FilterEffects {

  @Effect()
    init$: Observable<Action> = this.actions$.pipe(
        ofType<FilterActions.AddCategory>(FilterActionTypes.AddFilter, FilterActionTypes.RemoveFilter),
        withLatestFrom(this.store, ( _ , state) => {
          of(state).pipe(
            select(fromFilter.getAllFilters),
            switchMap(results => this.localStorageService.setFilters(results)
              .pipe(
                catchError(error => {
                  return of(new FilterActions.SavedSelectedCategoriesFailed());
                })
              )
            ),
            tap(results => {
              this.store.dispatch(new LogActions.AddLogFromFilterEffect({location: 'Filter Effect', message: results.statusText}));
            }),
          ).subscribe();
        }),
        map( _ => new FilterActions.SavedSelectedCategories()),
    );

  @Effect()
  loadFoos$ = this.actions$.pipe(ofType(FilterActionTypes.LoadFilters));

  constructor(
    private actions$: Actions,
    private store: Store<fromFilter.State>,
    private localStorageService: LocalStorageService
  ) {}
}
