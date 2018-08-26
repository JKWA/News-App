import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, take, map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Store, select, Action } from '@ngrx/store';
import * as fromCategory from './../reducers';
import * as CategoryActions from '../actions/category.actions';
import { CategoryActionTypes } from '../actions/category.actions';
import { LocalStorageService } from '../services/local-storage.service';
import * as ServiceMessage from '../messages/service.messages';
import { Category } from '../enums/category.enum';
import { CategoryDefault } from '../shared/defaults/category.default';
import { stringToCategory } from '../shared/utility/category.utility';


@Injectable()
export class CategoryEffects {

  @Effect()
  saveSelectedCategories$: Observable<Action> = this.actions$.pipe(
    ofType<CategoryActions.AddCategory>(CategoryActionTypes.AddCategory, CategoryActionTypes.RemoveCategory),
    withLatestFrom(this.store, ( action , state) => state),
    select(fromCategory.getAllCategories),
    map(allCategories => Array.from(allCategories.values()).filter(result => result.selected).map(category => category.id)),
    tap(allCategories => {
      if ( allCategories.length === 0 ) {
        this.store.dispatch( new CategoryActions.AddCategory(Category.General));
      }
    }),
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
  init$: Observable<Action> = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    withLatestFrom(
      of(new CategoryDefault().createAllCategories),
      this.localStorageService.getCategoryViewed(),
      this.localStorageService.getSelectedCategories(),
      ( _ , allCategories, viewedCategory, savedSelectedCategories) => {
        const selectedCategories = savedSelectedCategories
            ? savedSelectedCategories
            : new CategoryDefault().getDefaultSelectedCategories;

        allCategories.forEach(categoryItem => {
            selectedCategories.has(stringToCategory(categoryItem.id))
                ? categoryItem.selected = true
                : categoryItem.selected = false;
        });
        return  new CategoryActions.LoadCategorys({setCategory: viewedCategory, allCategories});

      }),

  );


  constructor(
    private actions$: Actions,
    private localStorageService: LocalStorageService,
    private store: Store<fromCategory.State>,
  ) {}
}
