import { TestBed } from '@angular/core/testing';
import { Observable, empty } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { CategoryEffects } from './category.effects';
import * as fromCategory from './../reducers';
import { Category } from '../enums/category.enum';
import * as CategoryActions from './../actions/category.actions';
import { ServiceMessageModel } from '../models/service-message.model';
import { LocalStorageMessage } from '../messages/service.messages';
import { LocalStorageService } from './../services/local-storage.service';


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
}

describe('CategoryEffects', () => {
  let effects: CategoryEffects;
  let actions$: TestActions;
  let storageService: MockStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryEffects,
        provideMockActions(() => actions$),
        { provide: LocalStorageService, useClass: MockStorageService },
        { provide: Actions, useFactory: getActions },
      ],
      imports: [
        StoreModule.forRoot({...fromCategory.reducers}),
      ],
    });

  effects = TestBed.get(CategoryEffects);
  storageService = TestBed.get(LocalStorageService);
  actions$ = TestBed.get(Actions);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('"SetCategory" should return a SavedViewedCategory, with success message, on success', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().successMessage;
    const category = Category.Science as Category;
    const action = new CategoryActions.SetCategory(category);
    const completion = new CategoryActions.SavedViewedCategory(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: serviceMessage });
    const expected = cold('--c', { c: completion });
    storageService.setCategoryViewed.and.returnValue(response);
    expect(effects.categorySetView$).toBeObservable(expected);
  });

  it('"SetCategory" should return a SavedViewedCategoryFailed, with error message, on failure', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().errorMessage;
    const category = Category.Science as Category;
    const action = new CategoryActions.SetCategory(category);
    const completion = new CategoryActions.SavedViewedCategoryFailed(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', { b: serviceMessage });
    const expected = cold('--c', { c: completion });
    storageService.setCategoryViewed.and.returnValue(response);
    expect(effects.categorySetView$).toBeObservable(expected);
  });

  it('"AddCategory" should return a SavedSelectedCategories, with success message, on success', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().successMessage;
    const category = Category.Science as Category;
    const action = new CategoryActions.AddCategory(category);
    const completion = new CategoryActions.SavedSelectedCategories(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: serviceMessage});
    const expected = cold('--c', { c: completion });
    storageService.setSelectedCategories.and.returnValue(response);
    expect(effects.saveSelectedCategories$).toBeObservable(expected);
  });

  it('"AddCategory" should return an SavedViewedCategoryFailed, with error message, on failure', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().errorMessage;
    const category = Category.Science as Category;
    const action = new CategoryActions.AddCategory(category);
    const completion = new CategoryActions.SavedSelectedCategoriesFailed(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', { b: serviceMessage});
    const expected = cold('--c', { c: completion });
    storageService.setSelectedCategories.and.returnValue(response);
    expect(effects.saveSelectedCategories$).toBeObservable(expected);
  });

  it('"RemoveCategory" should return a SavedSelectedCategories, with success message, on success', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().successMessage;
    const category = Category.Science as Category;
    const action = new CategoryActions.RemoveCategory(category);
    const completion = new CategoryActions.SavedSelectedCategories(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: serviceMessage});
    const expected = cold('--c', { c: completion });
    storageService.setSelectedCategories.and.returnValue(response);
    expect(effects.saveSelectedCategories$).toBeObservable(expected);
  });

  it('"RemoveCategory" should return a SavedSelectedCategoriesFailed, with error message, on failure', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().errorMessage;
    const category = Category.Science as Category;
    const action = new CategoryActions.RemoveCategory(category);
    const completion = new CategoryActions.SavedSelectedCategoriesFailed(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', { b: serviceMessage});
    const expected = cold('--c', { c: completion });
    storageService.setSelectedCategories.and.returnValue(response);
    expect(effects.saveSelectedCategories$).toBeObservable(expected);
  });

});
