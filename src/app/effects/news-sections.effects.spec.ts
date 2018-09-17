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
import { LocalStorageGetMessage,  LocalStorageSetMessage} from '../messages/service.messages';
import { LocalStorageService } from '../services/local-storage.service';
import { SharedModule } from '../shared/shared.module';
import { NewsSectionDefault } from '../shared/defaults/news-section.default';
import { State } from '../reducers/news-section.reducer';
import { setSelectedNewsSections } from '../shared/utility/news-section.utility';
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
    const serviceMessage: ServiceMessageModel = new LocalStorageSetMessage().successMessage;
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

    const serviceMessage: ServiceMessageModel = new LocalStorageSetMessage().errorMessage;
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
    const serviceMessage: ServiceMessageModel = new LocalStorageSetMessage().successMessage;
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

    const serviceMessage: ServiceMessageModel = new LocalStorageSetMessage().errorMessage;
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

    const serviceMessage: ServiceMessageModel = new LocalStorageSetMessage().successMessage;
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

    const serviceMessage: ServiceMessageModel = new LocalStorageSetMessage().errorMessage;
    const newsSelection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.RemoveNewsSection(newsSelection);
    const completion = new NewsSectionActions.SavedSelectedNewsSectionsFailed(serviceMessage);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', { b: serviceMessage});
    const expected = cold('--c', { c: completion });
    storageService.setSelectedNewsSections.and.returnValue(response);
    expect(effects.saveSelectedNewsSections$).toBeObservable(expected);
  });

  it('"InitNewsSections" should return a LoadCurrentlyViewingNewsSection, with NewsSection, on success', () => {
    const newsSection = NewsSection.Science as NewsSection;
    const action = new NewsSectionActions.InitNewsSections();
    const completion = new NewsSectionActions.LoadCurrentlyViewingNewsSection(newsSection);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: newsSection});
    const expected = cold('--c', { c: completion });
    storageService.getNewsSectionViewing.and.returnValue(response);
    expect(effects.getNewsSectionViewing$).toBeObservable(expected);
  });

  it('"InitNewsSections" should return a LoadCurrentlyViewingNewsSectionDefault, with NewsSection, on failure', () => {
    const newsSection = new NewsSectionDefault().getDefaultViewingNewsSection;
    const serviceMessage: ServiceMessageModel = new LocalStorageGetMessage().errorMessage;
    const action = new NewsSectionActions.InitNewsSections();
    const completion = new NewsSectionActions.LoadCurrentlyViewingNewsSectionDefault(newsSection);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#', { b: serviceMessage});
    const expected = cold('--c|', { c: completion });
    storageService.getNewsSectionViewing.and.returnValue(response);
    expect(effects.getNewsSectionViewing$).toBeObservable(expected);
  });

  it('"InitNewsSections" should return a LoadAllNewsSections, with all sections and seleted value, on success', () => {
    const allNewsSections = new NewsSectionDefault().createAllNewsSections;
    const viewedNewsSection = new Set([NewsSection.Business, NewsSection.Entertainment]);
    const responseValue = setSelectedNewsSections(viewedNewsSection, allNewsSections);
    const action = new NewsSectionActions.InitNewsSections();
    const completion = new NewsSectionActions.LoadAllNewsSections(responseValue);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-b|', { b: viewedNewsSection});
    const expected = cold('--c', { c: completion });
    storageService.getSelectedNewsSections.and.returnValue(response);
    expect(effects.getSelectedNewsSections$).toBeObservable(expected);
  });

  it('"InitNewsSections" should return a LoadCurrentlyViewingNewsSection, with NewsSection, on success', () => {
    const serviceMessage: ServiceMessageModel = new LocalStorageGetMessage().errorMessage;
    const allNewsSections = new NewsSectionDefault().createAllNewsSections;
    const viewedNewsSection = new NewsSectionDefault().getDefaultSelectedNewsSections;
    const responseValue = setSelectedNewsSections(viewedNewsSection, allNewsSections);
    const action = new NewsSectionActions.InitNewsSections();
    const completion = new NewsSectionActions.LoadAllNewsSectionsDefault(responseValue);

    actions$.stream = hot('-a', { a: action });
    const response = cold('-#|', { b: serviceMessage});
    const expected = cold('--c|', { c: completion });
    storageService.getSelectedNewsSections.and.returnValue(response);
    expect(effects.getSelectedNewsSections$).toBeObservable(expected);
  });

});
