import { TestBed } from '@angular/core/testing';
import { Observable, of, empty } from 'rxjs';
import { StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { NewsSectionEffects } from './news-sections.effects';
import * as fromNewsSection from '../reducers';
import { NewsSection } from '../enums/news-section.enum';
import * as NewsSectionActions from '../actions/news-section.actions';
import * as NewsActions from '../actions/news.actions';
import { ServiceMessageModel } from '../models/service-message.model';
import { LocalStorageMessage } from '../messages/service.messages';
import { LocalStorageService } from '../services/local-storage.service';
import { SharedModule } from '../shared/shared.module';
import { NewsSectionDefault } from '../shared/defaults/news-section.default';
import { State } from '../reducers/news-section.reducer';

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
  getSelectedNewsSections = jasmine.createSpy('getSelectedNewsSections');
  setSelectedNewsSections = jasmine.createSpy('setSelectedNewsSections');
  getNewsSectionViewing = jasmine.createSpy('getNewsSectionViewing');
  setNewsSectionViewing = jasmine.createSpy('setNewsSectionViewing');
}

describe('NewsSectionEffects', () => {
  let effects: NewsSectionEffects;
  let actions$: TestActions;
  let storageService: MockStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NewsSectionEffects,
        provideMockActions(() => actions$),
        { provide: LocalStorageService, useClass: MockStorageService },
        { provide: Actions, useFactory: getActions },
      ],
      imports: [
        SharedModule,
        StoreModule.forRoot({...fromNewsSection.reducers}),
      ],
    });

  effects = TestBed.get(NewsSectionEffects);
  storageService = TestBed.get(LocalStorageService);
  actions$ = TestBed.get(Actions);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it('"SetCurrentlyViewingNewsSection" should return a SavedViewedNewsSection, with success message, on success', () => {
    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().successMessage;
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.SetCurrentlyViewingNewsSection(newsSelection);
    const completion = new NewsSectionActions.SavedViewedNewsSection(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: serviceMessage });
    const expected = cold('--c', { c: completion });
    storageService.setNewsSectionViewing.and.returnValue(response);
    expect(effects.newsSelectionSetView$).toBeObservable(expected);
  });

  it('"SetCurrentlyViewingNewsSection" should return a SavedViewedNewsSectionFailed, with error message, on failure', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().errorMessage;
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.SetCurrentlyViewingNewsSection(newsSelection);
    const completion = new NewsSectionActions.SavedViewedNewsSectionFailed(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', { b: serviceMessage });
    const expected = cold('--c', { c: completion });
    storageService.setNewsSectionViewing.and.returnValue(response);
    expect(effects.newsSelectionSetView$).toBeObservable(expected);
  });

  it('"AddNewsSection" should return a SavedSelectedNewsSections, with success message, on success', () => {
    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().successMessage;
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.AddNewsSection(newsSelection);
    const completion = new NewsSectionActions.SavedSelectedNewsSections(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: serviceMessage});
    const expected = cold('--c', { c: completion });
    storageService.setSelectedNewsSections.and.returnValue(response);
    expect(effects.saveSelectedNewsSections$).toBeObservable(expected);
  });


  it('"AddNewsSection" should return a SavedSelectedNewsSections, with success message, on success', () => {
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.AddNewsSection(newsSelection);
    const completion = new NewsActions.GetAdditionalNewsFromApi(newsSelection);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: newsSelection});
    const expected = cold('-c', { c: completion });
    storageService.setSelectedNewsSections.and.returnValue(response);
    expect(effects.addNewNewsSectionApiData$).toBeObservable(expected);
  });

  it('"AddNewsSection" should return a SavedSelectedNewsSections, with success message, on success', () => {
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.AddNewsSection(newsSelection);
    const completion = new NewsSectionActions.SetCurrentlyViewingNewsSection(newsSelection);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: completion });
    expect(effects.switchNewsSectionViewed$).toBeObservable(expected);
  });

  it('"AddNewsSection" should return a SetCurrentlyViewingNewsSection, with newsSelection, on success', () => {
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.AddNewsSection(newsSelection);
    const completion = new NewsSectionActions.SetCurrentlyViewingNewsSection(newsSelection);

    actions$.stream = hot('-a', { a: action });
    const expected = cold('-c', { c: completion });
    expect(effects.switchNewsSectionViewed$).toBeObservable(expected);
  });

  it('"AddNewsSection" should return an SavedViewedNewsSectionFailed, with error message, on failure', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().errorMessage;
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.AddNewsSection(newsSelection);
    const completion = new NewsSectionActions.SavedSelectedNewsSectionsFailed(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', { b: serviceMessage});
    const expected = cold('--c', { c: completion });
    storageService.setSelectedNewsSections.and.returnValue(response);
    expect(effects.saveSelectedNewsSections$).toBeObservable(expected);
  });

  it('"RemoveNewsSection" should return a SavedSelectedNewsSections, with success message, on success', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().successMessage;
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.RemoveNewsSection(newsSelection);
    const completion = new NewsSectionActions.SavedSelectedNewsSections(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: serviceMessage});
    const expected = cold('--c', { c: completion });
    storageService.setSelectedNewsSections.and.returnValue(response);
    expect(effects.saveSelectedNewsSections$).toBeObservable(expected);
  });

  it('"RemoveNewsSection" should return a SavedSelectedNewsSectionsFailed, with error message, on failure', () => {

    const serviceMessage: ServiceMessageModel = new LocalStorageMessage().errorMessage;
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.RemoveNewsSection(newsSelection);
    const completion = new NewsSectionActions.SavedSelectedNewsSectionsFailed(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', { b: serviceMessage});
    const expected = cold('--c', { c: completion });
    storageService.setSelectedNewsSections.and.returnValue(response);
    expect(effects.saveSelectedNewsSections$).toBeObservable(expected);
  });


  it('"InitNewsSections" should return a LoadNewsSections, with default and/or saved data, on success', () => {

    const newsSelection = NewsSection.Science as NewsSection;
    const allNewsSections = new NewsSectionDefault().createAllNewsSections;
    const selectedNewsSections = new Set([NewsSection.General, NewsSection.Health, NewsSection.Sports]);

     // combine selected newsSelection data with all categories
     selectedNewsSections.forEach(result => {
      allNewsSections.set(result, {...allNewsSections.get(result), selected: true});
    });

    // the LoadNewsSections payload
    const newState: State = {
      allNewsSections: allNewsSections,
      currentlyViewingNewsSection: newsSelection
    };

    const action = new NewsSectionActions.InitNewsSections();
    const completion = new NewsSectionActions.LoadNewsSections(newState);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: newState});
    const expected = cold('--c', { c: completion });

    // do I need to fire off both services?
    storageService.getSelectedNewsSections.and.returnValue(selectedNewsSections);
    storageService.getNewsSectionViewing.and.returnValue(newsSelection);

    // ***  here is the first problem ***
    // loadInitialValues$ is not sending a stream,
    // is "withLatestFrom" is the problem?
    // perhaps because not flattened?
    expect(effects.loadInitialValues$).toBeObservable(expected);
  });

});
