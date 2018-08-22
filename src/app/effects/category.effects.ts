import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, take, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import * as fromCategory from './../reducers';
import * as CategoryActions from '../actions/category.actions';
import { CategoryActionTypes } from '../actions/category.actions';
import { LocalStorageService } from '../services/local-storage.service';
import * as ServiceMessage from '../messages/service.messages';


@Injectable()
export class CategoryEffects {

  @Effect()
  saveSelectedCategories$: Observable<Action> = this.actions$.pipe(
    ofType<CategoryActions.AddCategory>(CategoryActionTypes.AddCategory, CategoryActionTypes.RemoveCategory),
    withLatestFrom(this.store, ( action , state) => state), // {
    select(fromCategory.getAllCategories),
    map(allCategories => Array.from(allCategories.values()).filter(result => result.selected).map(category => category.id)),
    switchMap(arrayOfCategoryIds => this.localStorageService.setSelectedCategories(arrayOfCategoryIds)
      .pipe(
        map(() => new CategoryActions.SavedSelectedCategories(new ServiceMessage.LocalStorageMessage().successMessage)),
        catchError(() => of(new CategoryActions.SavedSelectedCategoriesFailed(new ServiceMessage.LocalStorageMessage().errorMessage)))
      )
    )
  );

  @Effect()
  categorySetView$: Observable<Action> = this.actions$.pipe(
    ofType<CategoryActions.SetCategory>(CategoryActionTypes.SetCategory),
    switchMap(results => this.localStorageService.setCategoryViewed(results.payload)
      .pipe(
        map( sucessMessage => new CategoryActions.SavedViewedCategory(sucessMessage)),
        catchError(() => {
          return of(new CategoryActions.SavedViewedCategoryFailed(new ServiceMessage.LocalStorageMessage().errorMessage));
        }),
      ),
    ),
  );

  @Effect()
  loadCategory$ = this.actions$.pipe(ofType(CategoryActionTypes.LoadCategorys));

  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private store: Store<fromCategory.State>,
  ) {}
}
