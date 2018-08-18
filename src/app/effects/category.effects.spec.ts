import { TestBed, inject } from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';
import { Location } from '@angular/common';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, empty } from 'rxjs';
import { CategoryEffects } from './category.effects';
import { StoreModule } from '@ngrx/store';
import * as fromCategory from './../reducers';
import { Category } from '../enums/category.enum';
import * as CategoryActions from './../actions/category.actions';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { LocalStorageService } from './../service/local-storage.service';
import { Actions } from '@ngrx/effects';
// import { AppEffects, SCHEDULER, DEBOUNCE } from './category.effects';


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
  setSelectedCategories = jasmine.createSpy('setSelectedCategories');
  setCategoryViewed = jasmine.createSpy('setCategoryViewed');
  setFilters = jasmine.createSpy('setFilters');
}

describe('CategoryEffects', () => {
  let effects: CategoryEffects;
  let actions$: TestActions;
  let storageService: MockStorageService;
  // let location: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({...fromCategory.reducers}),
      ],
      providers: [
        CategoryEffects,
        provideMockActions(() => actions$),
        { provide: LocalStorageService, useClass: MockStorageService },
        { provide: Actions, useFactory: getActions },
        // { provide: DEBOUNCE, useValue: 30 },
        // { provide: SCHEDULER, useFactory: getTestScheduler }
      ]
    });

  effects = TestBed.get(CategoryEffects);
  storageService = TestBed.get(LocalStorageService);
  actions$ = TestBed.get(Actions);
  // location = TestBed.get(Location);

  //   effects = TestBed.get(CategoryEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  // it('should return a SavedViewedCategory, with category, on success', () => {
  //   const category = Category.Science as Category;
  //   const action = new CategoryActions.SetCategory(category);
  //   const completion = new CategoryActions.SavedViewedCategory();

  //   actions$.stream = hot('-a', { a: action });
  //   const response = cold('-b|', { b: category });
  //   const expected = cold('--c', { c: completion });
  //   storageService.setCategoryViewed.and.returnValue(response);
  //   expect(effects.categorySetView$).toBeObservable(expected);
  // });

  // it('should return a SavedViewCategory, with category, on success', () => {
  //   const category = Category.Science as Category;

  //   const serviceResponse = {
  //     status: 2000,
  //     statusText: `Saved general to local storage`
  // };
  //   const action = new CategoryActions.AddCategory(Category.Science);
  //   const completion = new CategoryActions.SavedSelectedCategories();

  //   actions$.stream = hot('-a', { a: action });
  //   const response = cold('-b|', { b: serviceResponse });
  //   const expected = cold('--c', { c: completion });
  //   storageService.setCategoryViewed(category).and.returnValue(response);
  //   expect(effects.saveSelectedCategories$).toBeObservable(expected);
  // });

});
