import { TestBed } from '@angular/core/testing';
import { Observable, of, empty } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { CategoryEffects } from './category.effects';
import * as fromCategory from './../reducers';
import { Category } from '../enums/category.enum';
import * as CategoryActions from './../actions/category.actions';
import * as NewsActions from './../actions/news.actions';
import { ServiceMessageModel } from '../models/service-message.model';
import { LocalStorageMessage } from '../messages/service.messages';
import { LocalStorageService } from './../services/local-storage.service';
import { SharedModule } from './../shared/shared.module';
import { CategoryDefault } from '../shared/defaults/category.default';
import { State } from '../reducers/category.reducer';

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
  getSelectedCategories = jasmine.createSpy('getSelectedCategories');
  setSelectedCategories = jasmine.createSpy('setSelectedCategories');
  getCategoryViewed = jasmine.createSpy('getCategoryViewed');
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
        SharedModule,
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

  it('"SetCurrentlyViewingCategory" should return a SavedViewedCategory, with success message, on success', () => {
    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().successMessage;
    const category = Category.Science as Category;
    const action = new CategoryActions.SetCurrentlyViewingCategory(category);
    const completion = new CategoryActions.SavedViewedCategory(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: serviceMessage });
    const expected = cold('--c', { c: completion });
    storageService.setCategoryViewed.and.returnValue(response);
    expect(effects.categorySetView$).toBeObservable(expected);
  });

  it('"SetCurrentlyViewingCategory" should return a SavedViewedCategoryFailed, with error message, on failure', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().errorMessage;
    const category = Category.Science as Category;
    const action = new CategoryActions.SetCurrentlyViewingCategory(category);
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


  it('"AddCategory" should return a SavedSelectedCategories, with success message, on success', () => {
    const category = Category.Science as Category;
    const action = new CategoryActions.AddCategory(category);
    const completion = new NewsActions.GetAdditionalNewsFromApi(category);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: category});
    const expected = cold('-c', { c: completion });
    storageService.setSelectedCategories.and.returnValue(response);
    expect(effects.addNewCategoryApiData$).toBeObservable(expected);
  });

  it('"AddCategory" should return a SavedSelectedCategories, with success message, on success', () => {
    const category = Category.Science as Category;
    const action = new CategoryActions.AddCategory(category);
    const completion = new CategoryActions.SetCurrentlyViewingCategory(category);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: completion });
    expect(effects.switchCategoryViewed$).toBeObservable(expected);
  });

  it('"AddCategory" should return a SetCurrentlyViewingCategory, with category, on success', () => {
    const category = Category.Science as Category;
    const action = new CategoryActions.AddCategory(category);
    const completion = new CategoryActions.SetCurrentlyViewingCategory(category);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: completion });
    expect(effects.switchCategoryViewed$).toBeObservable(expected);
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


  it('"InitCategories" should return a LoadCategories, with default and/or saved data, on success', () => {

    const category = Category.Science as Category;
    const allCategories = new CategoryDefault().createAllCategories;
    const selectedCategories = new Set([Category.General, Category.Health, Category.Sports]);

     // combine selected category data with all categories
     selectedCategories.forEach(result => {
      allCategories.set(result, {...allCategories.get(result), selected: true});
    });

    // the LoadCategories payload
    const newState: State = {
      allCategories: allCategories,
      setCategory: category
    };

    const action = new CategoryActions.InitCategories();
    const completion = new CategoryActions.LoadCategories(newState);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: newState});
    const expected = cold('--c', { c: completion });

    // do I need to fire off both services?
    storageService.getSelectedCategories.and.returnValue(selectedCategories);
    storageService.getCategoryViewed.and.returnValue(category);

    // ***  here is the first problem ***
    // loadInitialValues$ is not sending a stream,
    // is "withLatestFrom" is the problem?
    // perhaps because not flattened?
    expect(effects.loadInitialValues$).toBeObservable(expected);
  });

});
